---
title: Ethereum Session Accounts
date: 2017-10-03
description: 'How we removed nearly every transaction confirmation pop-up from a fully on-chain game by delegating moves to a short-lived, client-generated session account, pre-funded for its own gas and refunded at the end.'
mediumLink: https://medium.com/@wighawag/ethereum-session-accounts-fc61fb930dac
image: /images/blog/session-accounts.png
titleImage: false
---

**Introduction**

For the last 3 month I have been working on Tug Of War (website is now down) a fully decentralised game, a game that run entirely on the [ethereum](https://ethereum.org) blockchain. It is now running on the testnets and we describe it in more details [here](https://medium.com/@etherplay/our-first-unstoppable-game-tug-of-war-bb69c63a8734) .

We basically wanted to build a pure blockchain game with a fun interface and we had to make sure the game experience was as smooth as possible. Since the game required several interactions (for each move) we wanted to get rid of most transaction confirmation popup as we could so players could stay engaged in the game. The obvious solution was to build our game using state channels.

As it turned out, state channels added some undesirable timing complexity. In the situation where one of the player did not turn up, an extra timeout was required and the other player had to make sure to send a transaction in time to make its case recorded on the blockchain even though none of the player could be sure if the other player sent the message or if it was lost on the way. The simple timeout period became more complex and this had to be reflected on the interface causing potential confusion for the players.

On top of that due to the nature of the game, state channels didn’t bring much advantages apart from a potentially lower gas cost. It is also worth noting that by having the game running entirely on the blockchain, it did not require any server and become an unstoppable game by itself. We might reconsider state channel though for later games.

Tug of War is a turn based game where turn can be as long as 24h to ensure players can still play asynchronously on their own schedule. On the other hand if both players are online, they could well finish the game in 30 minutes. If you did play you might have wondered how come the game run on the blockchain with only one transaction per player. It turns out that there is one transaction per move but they are hidden from view.

**Session accounts**

Our solution to get rid of most confirmation popup is actually quite simple and I was surprised to not see it used elsewhere since there are several dapps out there that require you to confirm many transactions for one particular task.

The solution is as follow : upon starting a game, a player gives rights to a temporary account that will make the next moves instead on its behalf. We used to call these account “shadow account” but a better name could well be “session account” since they operate like a short lived session.

These accounts’ private key are generated and stored client side. This was not an issue for our game since a secret was also required to be stored to account for the “hash and reveal” scheme used.

Upon setting the session account the first transaction also send some fund to it to cover the future moves’ gas cost. It means you need to be able to predict the gas required for the future interactions. This was trivial to compute the maximum gas required for our game but this is a lot higher than an average game’s requirement. Hence a refund mechanism was needed : On the final move, the funds not used by the session account are given back to the player account.

**Smart contract**

On the smart contract side, the method called as part of the first transaction (to create/start the game) is given the address of the session account by the player (that generated it client side) and store it. This method also transfers fund to that session account as gas allowance to be able to make further call by itself.

The other methods that are to be called during the session (in our case a game is a session) check whether the sender is the assigned session acount or the original player (we still allow player to execute the transaction in case gas run out, for example due to gas price increase). That’s basically it: the session account can now act on behalf of the player. It means the player can perform actions without requiring approval via interrupting popups.

The last bit is that the session account send the fund not used back to the player when the session ends. While this could be done independently of the smart contract we allow the final transaction to pass a value so that the session account can give back the fund to the player at the same time as calling that last method.

![session accounts](../../images/blog/session-accounts.png)

**interface side requirements**

This solution requires the safe storage of private key and currently the web3 api do not offer an api to encrypt such data.

The web3 api would benefit in having such method. There is a EIP for it here : [https://github.com/ethereum/EIPs/issues/130](https://github.com/ethereum/EIPs/issues/130) and I hope it get adopted sooner rather than latter. In the mean time we plan do it ourselves but would require the player to remember another passphrase.

On the fully decentralised side of thing we will also require a way to store data in a secure deterministic location. Swarm has plan to tackle this too and I look forward to where it leads.

**Conclusion**

The use of session account allows players to focus on the game and not get bothered with scary ethereum transaction popup for every move. As player you might almost wonder if you really are playing on a blockchain.

You can have a look at the smart contract here : [https://rinkeby.etherscan.io/address/0x8242e199f7d0559403f668e8d75db7c90c49a2af#code](https://rinkeby.etherscan.io/address/0x8242e199f7d0559403f668e8d75db7c90c49a2af#code)

The create method and start method accept a “shadow” argument. This get stored and they get sent a gas allowance. Then for every functions that need authentication, the sender is checked against that account.

This could be applied to other dapp too that require several transactions for one bigger task. We actually plan to use it for our own skill game platform ([https://etherplay.io](https://etherplay.io/)) so a player’s score is automatically submitted. You might have a use case for it too.

Thanks for reading

Do not hesitate to leave a comment if you have any questions
