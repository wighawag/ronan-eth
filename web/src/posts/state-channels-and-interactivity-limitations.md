---
title: State Channels and Interactivity limitations
date: 2018-08-09
description: 'State channels are sold as instant and fee-less, but conflict resolution still runs at blockchain speed. Walking through a two-player card game to show why that worst case makes real-time games impossible with state channels alone.'
mediumLink: https://medium.com/@wighawag/state-channels-and-interactivity-limitations-2872912f9d73
image: /images/blog/state_chans.png
# titleImage: false
caption: Ethhub
captionLabel: Image source
captionLink: https://docs.ethhub.io/ethereum-roadmap/layer-2-scaling/state-channels/
---

# Introduction

State channel is often described as a way to scale and speed up operations on a blockchain network without sacrificing much security. They are described as fee-less and nearly instant.

These 2 claims hold only in particular cases though. In a state channel network (as opposed to ad-hoc channel between only 2 participants), fees become required for example to ensure propagation across the network.

As for the “instant” property, it only holds true in the best case when channel participants are honest. What this means is often overlooked it seems and in this article I would like to describe what it means in the context of a 2 players card game using an ad-hoc state channel for simplicity.

# State channels

I won’t describe in details what state channel are here but for those not familiar, there are few resources :

[State Channels - an explanation](https://www.jeffcoleman.ca/state-channels/)

[Making Sense of Ethereum’s Layer 2 Scaling Solutions: State Channels, Plasma, and Truebit](https://medium.com/l4-media/making-sense-of-ethereums-layer-2-scaling-solutions-state-channels-plasma-and-truebit-22cb40dcc2f4)

In a nutshell, state channel allow transactions to happen offchain by letting the participants agree on state changes until the last. This means that once a channel is open, state changes can happen at the speed of light.

# Worst case scenarios

While this sounds perfect, the catch is that the logic that need to verify the validity of off-chain messages need to be computed on a blockchain in case of conflict.

Furthermore, in order to allow both participants to claim their rights, conflict resolution need to give time to both participants to respond. Since such resolution happens on-chain the time is unfortunately of blockchain scale.

# A card game example

What this means in the context of a card game for example is that each turn need to consider the worst case scenario and allows players to resolve conflict on the blockchain if needs arise, **making real time game impossible with state channels alone.**

Let say Alice and Bob want to play a game off-chain. Assuming they already established a channel between them, they send each other messages to play the game at the speed of internet.

Then let say that after some time Alice is not receiving any messages from Bob. If we are dealing with a game of cards with 30 seconds turn, she should be able to claim victory or a “default move” from Bob after that time elapsed. But this would not be fair:

If this could work like that she would then submit Bob’s last message plus her own last move on-chain to grab the money. Unfortunately, she could well be lying. Bob might have sent the message already​ and is waiting for Alice’s next message.

To cater for these case, the smart contract should allow Bob to reply to Alice’s on-chain claim. And Bob should be watching the blockchain.

And here again, if indeed Alice cheated, it would be correct to give the money to Bob and end the game there.

Unfortunately, it could also be that it was Bob, not sending the message and waiting in purpose for Alice to bring the game on-chain. Bob could have done that in purpose to render the game unplayable by bringing the full game resolution on-chain. This makes it impossible to have a 30s game, even less a real time game.

Note again, that it does not matter if this on-chain resolution takes place or not. The game would need to be able to continue working on blockchain time scale. Imagine you play a real time first person shooter game and suddenly the opponents is not responding. As described above, to ensure fairness the game need to allow both player to come back to the game after on-chain resolution happened. Unfortunately for this kind of game, this would be unacceptable since the gameplay relies on eye-hand coordination.

# Need for an another solution

This is a unacceptable situation. While there is no advantages for players to be playing on the blockchain, a malicious player like Bob with maybe more money, could suffer the cost and win by waiting the other player to give up. Bob could well be prepared to go on chain to maybe win few cents while Alice might just be playing for the fun and give up as soon as the cost of the onchain transaction compete with the prize in place.

In other words, since games would need to cater for blockchain times, in the order of minutes as opposed to near instant interaction as promised for offchain messages, **the application of state channels for interactive application (like games) stay limited to specific types of application that can accept blockchain times as worst case scenario**. Remember that this is the case because we need to cater for worst case scenario. If two honest players plays, the game could indeed be played with fast interactions but since the game would need to consider the worst case, a real time game could not be run using such technology alone.

# So where does this lead us to?

There is of course ways to solve this using a central operator but how could we solve this issue in a decentralized way?

We basically need a reliable decentralized time-stamping service that will sign each player’s message with its time of reception.

And what technology could provide time-stamping reliably in a decentralized manner? A blockchain of course. But we are then back to square one with “slow” consensus.

Are they any alternative?

At Etherplay ([https://etherplay.io](https://etherplay.io/)) we started thinking about a middle ground solution involving a set of witnesses.

The idea is to have several witnesses to chose from. Once two players agree on one, the chosen time-stamping service is used to prove to the others the existence of its previous message at specific times.

Of course, the chosen witness could collude with one of the player to claim existence of previous messages while not providing it at the time of the game.

In order to de-incentivize this behavior, witnesses could get paid a fee and get reputation score. This would allow player to select fair witnesses and punish unfair one.

This is not a perfect solution and open a whole can of worms. Nevertheless this could work for games as the rewards of one game would not be significant enough compared to the value of the witness reputation. Further works need to be done to design such system though.

One nice property of this potential time-stamping witness system is that it is game/app agnostic since their role is not to verify the game logic, but to prove reception of messages at specific times.

In other words, we need just one of this system running for all state channel games/apps that would require it, potentially increasing its decentralization.
