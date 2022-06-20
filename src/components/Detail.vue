<template>
  <div class="detail-wrap">
    <b-container>
      <div>
        <b-jumbotron>
          <div class="is-flex justify-content-md-center mb-3">
            <b-img
              v-if="!isConnect"
            
              thumbnail
              fluid
              rounded="circle"
              width="200"
           :src="makeit(prokres.wallet_address)"
              alt="Image 1"
            ></b-img>
          </div>

          <div class="is-flex justify-content-md-center text-center">
            <p>Login to send message to my Guest Book</p>
          </div>
          <div class="is-flex justify-content-md-center mb-3">
            <b-button
              v-if="isConnect"
              size="sm"
              class="haha"
              right
              @click="login"
            >
              <img style="height: 30px" :src="require('../images/a.svg')" />
              Login with unstoppable
            </b-button>
          </div>
             <div class="is-flex justify-content-md-center mb-3"  v-if="!isConnect">
        <a :href="`https://ud.me/${prokres.sub}`" target="_blank">{{prokres.sub}}</a>
          </div>
          <div class="is-flex justify-content-md-center" v-if="!isConnect">
            <b-button
              variant="primary"
              href="#"
              @click="$bvModal.show('send-message')"
              >Send Message</b-button
            >
          </div>
            <div class="is-flex justify-content-md-center" v-if="!isConnect">
            <b-button
              variant="danger"
              class="mt-3"
              @click="logout"
              >Logout</b-button
            >
          </div>
        </b-jumbotron>
      </div>
      <div class="pb-4">
        <b-card no-body>
          <b-tabs pills card>
            <b-tab title="Message" active>
              <div>
                <ul class="list-unstyled">
                  <b-media
                    tag="li"
                    v-for="(i, key) in messages"
                    :key="key"
                    class="my-2"
                  >
                    <template #aside>
                      <b-img
                        thumbnail
                        rounded="circle"
                        :src="makeit(i.address)"
                        
                        width="64"
                        alt="placeholder"
                      ></b-img>
                    </template>
                    <h5 class="mt-0 mb-1"><a :href="`https://ud.me/${i.name}`" target="_blank" style="text-decoration:none;">{{ i.name }}</a></h5>
                    <p class="mb-0">
                      {{ i.message }}
                    </p>
                 
                    <p class="mb-2">
                      {{ new Date(Number(i.date)) }}
                    </p>
                    <hr />
                  </b-media>
                </ul>
              </div>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </b-container>
    <div></div>
    <b-modal
      id="your-nft"
      size="xl"
      scrollable
      centered
      hide-footer
      title="Your NFTs"
    >
      <YourNFT
        :getMessages="getMessages"
        :pfp="pfp"
        :nftAddress="account"
        :cokim="$bvModal"
        :selector="selector"
        :getPFP="getPFP"
      />
    </b-modal>
    <b-modal
      id="send-message"
      size="xl"
      scrollable
      centered
      hide-footer
      title="Send message"
    >
      <b-form-textarea
        id="textarea"
        v-model="message"
        placeholder="Enter something..."
        rows="3"
        max-rows="6"
        class="mb-3"
      ></b-form-textarea>

      <b-button variant="primary" :disabled="disabled" @click="sendMessage()"
        >Send</b-button
      >
    </b-modal>
    <b-toast
      id="tx-confirm"
      title="Transaction Process"
      variant="info"
      solid
      no-auto-hide
    >
      Your transaction is being processed.
    </b-toast>
    <b-toast
      id="tx-success"
      title="Transaction Success"
      variant="success"
      solid
      auto-hide-delay="8000"
    >
      Your transaction is successful. Transaction
      <a
        target="_blank"
        :href="`https://explorer.testnet.near.org/transactions/${transactionId}`"
        >{{ transactionId }}</a
      >
    </b-toast>
    <b-toast
      id="tx-error"
      title="Error"
      variant="danger"
      solid
      auto-hide-delay="8000"
    >
      {{ errorMessage }}
    </b-toast>
  </div>
</template>
<script>
import YourNFT from "./YourNFT.vue";
import { providers, Account } from "near-api-js";
import UAuth from "@uauth/js";
import makeBlockie from 'ethereum-blockies-base64';

export default {
  name: "Detail",
  components: {
    YourNFT,
  },
  props: ["selector"],
  data: () => ({
    fields: [
      // A virtual column that doesn't exist in items
      { key: "account_id", label: "Account id" },
      // A column that needs custom formatting
      { key: "deposit", label: "Donation" },
      // A regular column
      "action",
      // A regular column
    ],
    transactionId: "",
    errorMessage: "",
    items: [],
    message: "",
    loadingData: true,
    donate: 0,
    isConnect: false,
    messages: [],
    account: "",
    pfp: "",
    disabled: false,
    prokres: false,
  }),
  created: async function () {
    try {
      const uauth = new UAuth({
        clientID: "743da06f-b543-475b-9f53-6e735213b5ea",
        redirectUri: "http://localhost:3000",
        scope: "openid wallet",
      });
      const a = await uauth.user();
      const b = await uauth.authorization();

      if (a && b) {
        this.isConnect = false;
        this.prokres = a;
        if (b.expiresAt < Date.now()) {
          this.isConnect = true;
        }
      }
      
    } catch (e) {
      this.isConnect = true;
    }
    const res=await fetch('/api/getto');
      const allMessage=await res.json();
    this.messages = allMessage.items.sort(function (a, b) {
        return Number(b.date) - Number(a.date);
      });
  },
  methods: {
    makeit(src){
return makeBlockie(src)
    },
    async login() {
      try {
        const uauth = new UAuth({
          clientID: "743da06f-b543-475b-9f53-6e735213b5ea",
          redirectUri: "http://localhost:3000",
          scope: "openid wallet",
        });
        const authorization = await uauth.loginWithPopup();
        if (authorization) {
          this.isConnect = false;
          const a = await uauth.user();
           this.prokres = a;
        }
        // console.log(authorization)
      } catch (e) {
        this.isConnect = true;

        // onJoinUnstoppable(false, null);
      }
    },
    async logout() {
      const uauth = new UAuth({
        clientID: "743da06f-b543-475b-9f53-6e735213b5ea",
        redirectUri: "http://localhost:3000",
        scope: "openid wallet",
      });
      await uauth.logout();
      this.isConnect = true;
      localStorage.clear();
    },
    async getMessages() {
      const nearRpc = new providers.JsonRpcProvider({
        url: "https://rpc.testnet.near.org",
      });

      const account = new Account(
        {
          provider: nearRpc,
          networkId: "testnet",
          signer: process.env.VUE_APP_CONTRACT,
          headers: {},
        },
        process.env.VUE_APP_CONTRACT
      );
      const allMessage = await account.viewFunction(
        process.env.VUE_APP_CONTRACT,
        "getMessages",
        {}
      );
      this.messages = allMessage.sort(function (a, b) {
        return Number(b.date) - Number(a.date);
      });
    },
    async getDeposit() {
      const nearRpc = new providers.JsonRpcProvider({
        url: "https://rpc.testnet.near.org",
      });

      const account = new Account(
        {
          provider: nearRpc,
          networkId: "testnet",
          signer: process.env.VUE_APP_CONTRACT,
          headers: {},
        },
        process.env.VUE_APP_CONTRACT
      );
      const allMessage = await account.viewFunction(
        process.env.VUE_APP_CONTRACT,
        "getAllDeposit",
        {}
      );

      this.items = allMessage
        .map((a) => ({
          account_id: a.key,
          deposit: `${Number(a.value) / 10 ** 24} NEAR`,
          action: "",
          donation: a.value,
        }))
        .sort(function (a, b) {
          return Number(b.donation) - Number(a.donation);
        });
    },
    async getPFP(account_id) {
      try {
        const nearRpc = new providers.JsonRpcProvider({
          url: "https://rpc.testnet.near.org",
        });

        const account = new Account(
          {
            provider: nearRpc,
            networkId: "testnet",
            signer: process.env.VUE_APP_CONTRACT,
            headers: {},
          },
          process.env.VUE_APP_CONTRACT
        );
        const image = await account.viewFunction(
          process.env.VUE_APP_CONTRACT,
          "getPFP",
          { account_id }
        );
        this.pfp = image;
      } catch (e) {
        console.log(e.message);
        this.pfp = "";
      }
    },
    async sendMessage() {
      this.disabled = true;
      if (this.message.trim().length === 0) {
        this.$bvToast.show("tx-error");
        this.errorMessage = "Please enter a message";
        this.disabled = false;
        return;
      }
      try {
        const data={message:this.message,name:this.prokres.sub,date:Date.now(),address:this.prokres.wallet_address}
      const response = await fetch("/api/inserto", {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  const messages=await response.json(); 
  this.message=""
  this.messages=messages.items.sort(function (a, b) {
        return Number(b.date) - Number(a.date);
      });
       this.$bvModal.hide("send-message");
       this.disabled=false
      
      } catch (e) {
        this.$bvToast.show("tx-error");
        this.errorMessage = e.message;
        this.disabled = false;
      }
      this.disabled = false;
    },
    async getYourMoneyBack() {
      this.disabled = true;
      try {
        const data = await this.selector.signAndSendTransaction({
          signerId: (await this.selector.getAccounts())[0].accountId,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "getYourMoneyBack",
                args: {},
                gas: 300000000000000,
              },
            },
          ],
        });
        if (
          localStorage.getItem("near-wallet-selector:selectedWalletId") ===
          '"near-wallet"'
        ) {
          this.$bvToast.show("tx-success");
          this.transactionId = "";
          this.getMessages();
          this.getDeposit();
          const self = this;
          setTimeout(() => self.$emit("refresh"), 1000);
        } else if (data.transaction.hash) {
          this.$bvToast.show("tx-success");
          this.transactionId = data.transaction.hash;
          this.getMessages();
          this.getDeposit();
          const self = this;
          setTimeout(() => self.$emit("refresh"), 1000);
        } else {
          this.$bvToast.show("tx-error");
          this.errorMessage = "can't send message";
          this.disabled = false;
        }
      } catch (e) {
        this.$bvToast.show("tx-error");
        this.errorMessage = e.message;
        this.disabled = false;
      }
      this.disabled = false;
    },
  },
};
</script>
<style lang="scss">
.haha {
  background: #4b47ee !important;
  padding-top: 10px;
  padding-bottom: 10px;
  border: none;
  border-radius: 8px;
  color: #fff;
  &:hover {
    background-color: #0b24b3;
  }
  &:focus {
    background-color: #0b24b3;
  }
  &:active {
    box-shadow: none;
    background-color: #5361c7;
  }
}
.detail-wrap {
  height: calc(100vh - 74px);
  background-color: #fff;
  .space-between {
    justify-content: space-between;
  }
  .list-attr {
    margin-top: 10px;
  }
  .content-left {
    padding: 24px;
    background-color: #f4f5f7;
    border-radius: 16px;
    border: none;
    .attr-item {
      padding: 10px;
      border-radius: 8px;
      text-align: center;
      width: calc(50% - 7px);
      .type {
        margin-bottom: 0;
        font-size: 10px;
        color: #9d22c1;
        text-transform: uppercase;
      }
      .name {
        font-weight: 600;
      }
      .rarity {
        font-size: 14px;
        color: #5e6c84;
      }
    }
  }
  .content-right {
    .nft-info {
      border: none;
      .equal {
        min-width: 95px;
      }
      .price-info {
        margin-bottom: 10px;
        font-weight: normal;
        align-items: flex-end;
        text-align: right;
        .value {
          font-weight: 700;
          font-size: 30px;
        }
        .token-symbol {
          font-weight: 700;
          font-size: 20px;
        }
      }
      .card-link {
        display: inline-block;
      }
      .btn-custom {
        padding: 8px 16px;
        border: none;
        font-weight: 700;
        border-radius: 8px;
        &:focus {
          box-shadow: none;
        }
      }
      .btn-market-order {
        color: #196ec2;
        background-color: rgba(25, 110, 194, 0.1);
        border-radius: 8px;
        &:hover {
          background-color: rgba(25, 110, 194, 0.295);
        }
      }
      .btn-buy-now,
      .btn-update,
      .btn-ask-sell {
        color: #fff;
        background-color: #9d22c1;
        &:hover {
          background-color: #891daa;
        }
      }
      .btn-cancel {
        color: #196ec2;
        background-color: rgba(25, 110, 194, 0.1);
        &:hover {
          background-color: rgba(25, 110, 194, 0.295);
        }
      }
    }
    .nft-acc {
      font-size: 14px;
      color: #0065ff;
    }
    .head {
      padding: 8px 16px;
      background-color: #f4f5f7;
    }
    .nft-name {
      color: #091e42;
      font-size: 30px;
      font-weight: 700;
    }
    .your-stake {
      > .card {
        border-radius: 8px;
        overflow: hidden;
      }
      .label {
        color: #5e6c84;
        font-weight: 400;
        font-size: 14px;
      }
    }
    .your-offer,
    .your-stake {
      > .card {
        border-radius: 8px;
        overflow: hidden;
      }
      .text-reward,
      .text-price {
        color: #5e6c84;
        font-weight: 400;
        font-size: 14px;
      }
      .card-link {
        padding: 0.375rem 0.75rem;
        margin-right: 10px;
        background-color: #9d22c1;
        color: #fff;
        margin-top: 5px;
        font-size: 12px;
        border-radius: 8px;
        border: none;
        font-weight: 700;
        &:hover {
          background-color: #891daa;
        }
      }
      .btn-remove {
        background-color: #e53b11;
        border: none;
        font-size: 12px;
        margin-top: 5px;
        border-radius: 8px;
        font-weight: 700;
        &:focus {
          box-shadow: none;
        }
        &:hover {
          background-color: #cc350f;
        }
      }
    }
    .best-offer {
      > .card {
        border-radius: 8px;
        overflow: hidden;
      }
      .text-address,
      .text-price {
        color: #5e6c84;
        font-weight: 400;
        font-size: 14px;
      }
      .text-balance {
        font-size: 20px;
        font-weight: 700;
      }
      .btn-sell {
        background-color: #e53b11;
        border: none;
        margin-left: 10px;
        border-radius: 8px;
        font-size: 12px;
        min-width: 80px;
        font-weight: 700;
        &:focus {
          box-shadow: none;
        }
        &:hover {
          background-color: #cc350f;
        }
      }
    }
    .best-offer-empty {
      img {
        width: 48px;
        margin: 20px auto 5px auto;
        display: block;
      }
      .best-offer-empty-text {
        width: 100px;
        margin: 10px auto 20px auto;
        display: block;
        color: #5e6c84;
      }
    }
  }
}
#bid-nft,
#update-bid-nft,
#ask-nft,
#update-ask-nft,
#sell-nft,
#buy-nft {
  .modal-content {
    border-radius: 16px;
    overflow: hidden;
  }
  .modal-header {
    background: linear-gradient(243.18deg, #f4d4fd 0%, #ffffff 100%);
    justify-content: center;
    border-bottom: none;
    .modal-title {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .close {
    position: absolute;
    right: 20px;
    top: 15px;
  }
}
</style>
