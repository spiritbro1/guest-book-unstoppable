<template>
    <div class="navbar-wrap nav-mobile">
        <b-navbar toggleable="lg" type="dark">
            <b-navbar-brand :href="`/`">
                <b-img height="30" :src="require('../images/panda.svg')"></b-img>
            </b-navbar-brand>
                <b-navbar-nav class="ml-auto">
                  
                    <b-nav-item class="w-nav native-balance" right v-if="!isConnect && account">                        
                        {{ balance/10**24 }} NEAR 
                    </b-nav-item>
                    
                    <b-nav-item class="w-nav address" right v-if="!isConnect && account">
                        <jazzicon
                            :address="account"
                            :diameter="20"
                            class="w-icon"
                            />
                       {{ account }}
                    </b-nav-item>
                
                    
                 
                    <b-button v-if="!isConnect" class="w-button btn-wallet-connect2" variant="danger" @click="selector.signOut()">Log out</b-button>
                </b-navbar-nav>
            <!-- </b-collapse> -->
        </b-navbar>
        <b-toast id="invalid-network" variant="danger" solid no-auto-hide>
            <template #toast-title>
                <div class="d-flex flex-grow-1 align-items-baseline">
                    <b-img blank blank-color="#ff5555" class="mr-2" width="12" height="12"></b-img>
                    <strong class="mr-auto">Invalid network</strong>
                </div>
            </template>
            Required to switch Metamask to <span style="cursor: pointer" @click="connect()"><b>{{ chainName }}</b></span>
        </b-toast>
        <b-toast id="required-metamask" variant="warning" solid>
            <template #toast-title>
                <div class="d-flex flex-grow-1 align-items-baseline">
                    <strong class="mr-auto">Metamask</strong>
                </div>
            </template>
            You have to install <b-link href="https://metamask.io/" target="_blank"><b>Metamask Extension</b></b-link>
        </b-toast>
    </div>
</template>
<script>

import { ethers } from 'ethers'
import { constants } from '@bazarion/sdk'

const NETWORKS = constants.NETWORKS
// import * as nearAPI from 'near-api-js';
export default {
   props:["selector"],
    data: () => ({
        chainName: NETWORKS[0].chainName,
        networks: NETWORKS.filter(n => (n.isSupported)),
        account: '',
        networkName: '',
        symbol: '',
        balance: ethers.BigNumber.from(0),
        isConnect: true,
        logoURI: ''
    }),
      destroyed(){
    this?.selector?.off("signIn",()=>{})
    this?.selector?.off("signOut",()=>{})
  },
    created: async function () {
     
const self=this;
if(this.selector.isSignedIn()){
   this.isConnect=false;
   const account=await this.selector.getAccounts();
   this.account=account[0].accountId;
 const body = {
                jsonrpc: '2.0',
                id: "dontcare",
                method: "query",
                params: {
                    request_type: "view_account",
                    finality: "final",
                    account_id: this.account
                }
            };

          const res=await fetch(this.selector.network.nodeUrl, {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            })
            const data=await res.json();
   this.balance=data.result.amount;
   console.log(data.result.amount)
 } 
this.selector.on("signIn",async () => {
    self.$emit("waku")
 if(self.selector.isSignedIn()){
   self.isConnect=false;
   const account=await self.selector.getAccounts();
   self.account=account[0].accountId;
    const body = {
                jsonrpc: '2.0',
                id: "dontcare",
                method: "query",
                params: {
                    request_type: "view_account",
                    finality: "final",
                    account_id: self.account
                }
            };
   const res=await fetch(self.selector.network.nodeUrl, {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            })
            const data=await res.json();
   self.balance=data.result.amount;
 } 
});
this.selector.on("signOut", () => {
    self.$emit("waku")
if(!self.selector.isSignedIn()){
   self.isConnect=true;
 } 
});
    },
    methods: {
              
    }
}
</script>
<style lang="scss">    
    .dropdown.nav-more{
        padding-left: 3px;
        padding-right: 3px;
        .nav-link{
            width: 36px;
            overflow: hidden;            
        }
        .dropdown-menu{
            min-width: 200px;
            padding: 0;
            border-radius: 8px;
            box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
            border: 1px solid rgb(255, 255, 255);
            .dropdown-item{
                padding: 10px 16px 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
    .multi-network{               
        .chain-logo{
            max-width: 22px;
            margin-right: 3px;
        }
        .dropdown-menu{
            padding: 0;
            border-radius: 8px; 
            box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
            border: 1px solid rgb(255, 255, 255);
            width: 214px;
            overflow: hidden;
        }
        .active{
            .dropdown-item{
                background-color: #e9ecef;
                position: relative;
                &::after{
                    content: "";
                    width: 8px;
                    height: 8px;
                    border-radius: 5px;
//                    background-color: #0fbc85;
                    display: inline-block;
                    position: absolute;
                    right: 8px;
                    top: 15px;
                }
            }
        }
        .dropdown-item{
            padding: 8px;     
        }

    }    
    .w-button, .w-nav{
        background-color: #fff;
        color: #212529;
        border-color: white;
        border-radius: 8px;
        margin-left: 15px;
        &:hover{
            background-color: #f6f6f6;
            color: inherit;
        }        
    }
    .w-button.btn-wallet-connect{
        background: #4b47ee;
        padding-top:10px;
        padding-bottom: 10px;
        border: none;
        border-radius: 8px;
        color: #fff;
        &:hover{
            background-color: #0b24b3;
        }
      &:focus{
            background-color: #0b24b3;
        }
         &:active{
            box-shadow: none;
            background-color: #5361c7;
        }
    }
    .w-button.btn-wallet-connect2{
        background: #e70e0e;
        padding-top:10px;
        padding-bottom: 10px;
        border: none;
        border-radius: 8px;
        color: #fff;
        &:hover{
            background-color: #f34804;
        }
        &:focus{
            box-shadow: none;
            background-color: #f34804;
        }
    }
    .w-nav{
        &.address{
            .nav-link{
                display:flex;
                align-items: center;
            }
            .w-icon{
                display: flex;
                margin-right: 5px;
            }    
        }
        em{
            color: #091E42!important;
        }
        a{
            color: #091E42!important;
            &:focus-visible{
                border: none;
                outline: none;
            }
        }
    }
    #dropdown-chains{
        color: #091E42!important;
    }
    @media(max-width: 991px){
        .nav-mobile{
            .navbar-nav{
                flex-direction: row;
                .dropdown-menu{
                    position: absolute;
                }
                .nav-link{
                    padding-left: 8px;
                    padding-right: 8px;
                }
            }
            .network-name{
                display: none;
            }
        }
    }
    @media(max-width: 580px){
        .nav-mobile{
            .navbar-nav{
                .native-balance{
                    display: none;
                }
            }
        }
        .multi-network{
            .dropdown-menu{
                &.dropdown-menu-right{
                    left: 0;
                    right: auto;
                }
            }
        }
    }
</style>
