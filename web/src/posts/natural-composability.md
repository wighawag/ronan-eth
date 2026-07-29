---
title: 'Natural Composability in Autonomous Worlds'
date: 2023-10-31
image: /images/blog/natural-composability.png
---

The concept of “[Autonomous Worlds](https://0xparc.org/blog/autonomous-worlds)” championed by [ludens](https://twitter.com/l_udens) from [0xPARC](https://0xparc.org/), has effectively united the close-knit community of on-chain game developers under a shared meme.

In this article, after proposing our own definition of the term, we will explore how worlds imbued by unchanging rules can benefit from what we call "Natural Composability", which lets worlds be expanded in unexpected ways while maintaining the immutability of their rules. It differs from traditional on-chain API and logic hooks that only work on a pre-established input set. As we'll see, **with Natural Composability, new rules that were not imagined beforehand can emerge permissionlessly.**

## Autonomous Worlds, A Definition

<p align="center">
<img style="padding-bottom:2em;" src="/images/blog/conquest-render.png" alt="Conquest's autonomous world">
</p>

At [Etherplay](https://etherplay.io), we have been building fully on-chain games since 2016-[2017](https://etherplay.io/blog/our-first-unstoppable-game-tug-of-war/) and what we consider to be Autonomous Worlds since [early 2019](https://github.com/wighawag/the_eternal_dungeon/commit/b283988cccf37c63c290b5bd5465bfe5bb3dc7ad) following in the footsteps of [Huntercoin](https://xaya.io/huntercoin-legacy). We started our adventure with the aptly named "[Ethernal](https://ethernal.land/)" in collaboration with [Jia](https://twitter.com/OhJia), and then launched the autonomous version of [Conquest.eth](https://conquest.game) in April 2022 which will remain live until [Gnosis](https://www.gnosis.io/), the chain it runs on, dies if ever (See our recent [announcement](https://etherplay.io/blog/conquest-is-open-source/)). And so naturally, while there are different perspectives on the subject (see [survey](https://medium.com/@syora/the-survey-of-the-definition-of-autonomous-world-30407d07895a)), we've developed our own distinctive definition. Additionally, we've coined an equivalent term: ["Infinite Games"](https://ronan.eth.limo/blog/infinite-games/).

To us, an Autonomous World is a digital and living creation, evolving through human inputs by means of immutable rules, most probably a game, **designed in a way that enables its continuous existence without reliance on external influences, save for the actions of the players themselves**. It's important to highlight that although players actively shape the evolution of the game, they must still abide by the world's established rules, essentially adhering to the digital physics that govern it.

In other words, there is no overlord and no developer/admin able to update the world and it is the rules encoded in the software along the player inputs that dictate the world's evolution. Interestingly, while the rules cannot be changed, the way the game looks and gets played (the User Interface, but also any automation tools helping players, or the general meta game) can evolve independently and we can even imagine multiple themes used for the same world.

Note that immutability here is of course not fully guaranteed as the network of computers such worlds runs on, relies on social coordination and changes can always be made by the community. A better term could instead be that of [“hardness”](https://stark.mirror.xyz/n2UpRqwdf7yjuiPKVICPpGoUNeDhlWxGqjulrlpyYi0). We use the word “immutability” in this article though as we believe it better captures what it enables when sufficient hardness is present, but consider the caveats.

It is also worth noting that Bitcoin and any sufficiently decentralized blockchain network are also immutable in the same way but again the caveats of “hardness” come into play and autonomy can be seen in different light depending on the community. Is Bitcoin with its hard stance on code change more autonomous than Ethereum with its ability to fork with community approval or is it the converse? In any case, Autonomous Worlds run on these networks and keep that property of immutability while adding new rules that make it more interesting and interactive for its inhabitants: **An immutable ruleset with a meaning that extends beyond the on-chain rules and lives in the players’ heads and interactions among them.**

::: info Note

We don’t want to prescribe what these ruleset are though and to that extent it might be worth considering sufficiently decentralized blockchain networks like Bitcoin as Autonomous Worlds too but we are here because we want to explore more complex and interesting worlds made possible by programmable blockchains.

:::

Secondly, it's crucial that the world must not arbitrarily restrict players' participation beyond the use of a fee or stake (to keep the system fair and secure). Any world that arbitrarily limits the number of players or uses whitelists for entry cannot be considered an Autonomous World. **It must be permissionless**. This requirement also entails being resistant to censorship, where no single entity dictates even the order of player actions, mirroring the characteristics of a decentralized blockchain network. Once more, an Autonomous World upholds this principle.

::: info Note

As a game designer, it's thus essential to give thoughtful consideration to the notion of player accounts and their capabilities within your world.

Remember that from the perspective of a [smart contract](https://ethereum.org/en/smart-contracts/), there are no humans; there are only accounts, which can be operated by automated bots solely focused on extracting value, without regard for the broader significance of your world. If values can be extracted, it will be.

We would thus argue that an Autonomous World must be designed to prevent all the potential issues affecting its gameplay to be considered one. Not all blockchains are created equal and while there are different mechanisms that work (proof of stake, proof of work), not all blockchain systems are designed equally. Calling a badly designed blockchain a blockchain misses the point. And so the same applies to Autonomous Worlds.

:::

Moreover, the world must not be deliberately constrained by time and **should ideally possess an unlimited lifespan, permitting any extensions to be unrestricted by arbitrary time constraints**. To put it differently, games with predetermined endings, like many session-based on-chain games today, such as [Dark Forest,](https://zkga.me/) do not meet the criteria for being Autonomous Worlds. These games essentially function as traditional games on the blockchain, albeit with the added feature of enabling fair gameplay (although one should remain cautious in these cases, about collusion in games involving more than two players) and interoperability.

::: info Note

A key difference between the two that highlight the true power of Autonomous Worlds is that for session based games, extensions are mere source code. They only really live in a git repository and are thrown into existence for a session before being useless again.

On the other hand, with Autonomous Worlds, extensions themselves embody [hyperstructures](https://jacob.energy/hyperstructures.html) (“Crypto protocols that can run for free and forever, without maintenance, interruption or intermediaries”). **They have the ability to inherit the properties of the network upon which the world operates.**

This critical distinction not only sheds light on the essence of Autonomous Worlds but also offers a glimpse into why they generate such enthusiasm regarding their composability.

:::

Now that we have our definition out of the way, let's discuss the potential for composability in worlds with immutable rules. And to start, let's deal with an interesting property shared by all on-chain games.

## Permissionless API

<p align="center">
<img style="padding-bottom:2em;" src="/images/blog/conquest-composability.png" alt="Conquest's Composability">
</p>

Onchain games all have an open and permissionless API. Such an API can even be considered as raw database access since its data format and access pattern are not prescribed. This is a given due to the nature of smart contracts and the blockchain networks they run on, but the type of data being provided can have a profound effect on the potential composability. As game designers we thus need to think carefully about the API we expose and make sure it provides the necessary information for interesting extensions to be possible/easier. It is often a hard trade-off as extra computation/storage cost is often needed to let this data be (more) accessible.

**These APIs let players add their own logic on top of the game and this without any permission required.** There is no API key to request, not even servers to connect to. We can see this in the plugin system of [Dark Forest](https://zkga.me/), [Conquest.eth](https://conquest.game/) and [Mithraeum](https://mithraeum.io/). Players can for example create in-game marketplaces that were not present at launch and let players better coordinate. We can also see this in [DeFi](https://ethereum.org/en/defi/) too with [Uniswap](https://uniswap.org/) v2 liquidity token as [ERC20](https://ercs.ethereum.org/ERCS/erc-20), which enabled liquidity incentive pools for example.

These extensions can create new behavior in players too. For example in Dark Forest the [Night Market plugin](https://blog.zkga.me/nightmarket) allows players to sell planet coordinates. They can then use this to play as an information agent. Similarly, in [Conquest.eth](https://conquest.game/), while the core game only allows players to send spaceships and attack each other, marketplaces allow a new kind of player, one that does not need to participate in battles. With marketplaces, they can enter the game and sell the spaceships they produce and remain peaceful. Similarly a player can join the game without staking on any planets if they can buy spaceships to conquer others’ planets and start their empire this way. Furthermore, on-chain alliances governed by smart contracts, that [Conquest.eth](https://conquest.game/) supports natively, let players coordinate with on-chain treaties or other diplomatic mechanisms. Combine the latter with marketplaces and the game now supports the idea of merchant alliances with, for example, a pact of non-aggression among its members.

But I suspect you would agree that such extensions do not ultimately change the game. They simply manifest what is possible and act as helpers for players to better coordinate and play. Do we need something else then to allow game logic to evolve beyond what was initially written? There are 2 obvious mechanisms that come to mind: **upgradeability** and **logic hooks**.

### Upgradeability

By Upgradeability, we mean that there are rules outside of the one dedicated to the game that let the game’s rules change. This one should probably not even be mentioned here because upgradeability simply means the world forgoes the immutability of its rules and thus its autonomy. Per definition above, this is not an Autonomous World anymore. But why would this matter you may ask.

Immutability of rules is crucial because this is what allows extensions to be protected from changes. Without immutability, extensions cannot rely on the world rules and would need to be upgradeable too to continue operating, and even the change of rules could break the concept behind the extension altogether. In other words, the API is not permissionless anymore and the world loses its autonomy. It can be pulled out from under you. We build on blockchain like [ethereum](https://ethereum.org) because we know what we build will continue to work. The same applies to Autonomous Worlds and their extensions.

::: info Note

It might be worth noting that a mechanism by which upgrades can happen without losing autonomy exists: [forks](https://ethereum.org/en/history/#the-history-of-ethereum). It does so with a high social cost though and would not be the best mechanism to offer extensibility, especially when we want these extensions to happen freely, permissionlessly without even majority approval. Such forks would also suffer from potentially breaking existing extensions and so the only feasible forks are most likely the one fixing unintended bugs.

:::

Furthermore and maybe more importantly, such an upgrade mechanism needs to be controlled, but how? A form of governance could be used, maybe using the game data itself. This unfortunately brings a risk of capture by which a certain set of players could change the rules to their advantage at the expense of others. They could also purposefully break existing extensions that do not fit their plan.

**Such governance cannot ultimately be separated from the game and prevents the world from being autonomous.**

::: info Note

This does not preclude the existence of worlds that embrace governance as part of the game mechanics. In which case, the game actually plays out in the potential political intrigue that such gameplay enables. But even in this case, there is a high chance that to make this type of game interesting, the upgradability remains limited to shape a certain type of gameplay. See for example [DAOG](https://austingriffith.com/portfolio/daog/) by [Austin Griffith](https://twitter.com/austingriffith).

:::

### Permissionless Logic Hooks

The other mechanism that might come to mind when thinking of extensibility and APIs is that of "logic hooks". We define "logic hooks" as mechanisms by which the world rules allow other rules to be included in the normal code pathway under certain conditions. This allows new mechanisms to be created that goes beyond what we discussed above.

Hooks can change the outcome of a player input, something the examples above (in Dark Forest, Conquest.eth and Mithraeum) cannot do. It can be something as simple as[ Uniswap V4 hooks](https://docs.uniswapfoundation.org/overview/whats-new-in-v4/hooks) where contracts can be invoked on certain events to perform different actions, allowed by the overall system but we can imagine more complex setup in a game setting that would allow players to redefine some of the game rules. This comes with its own game design risk though.

As an example, in Conquest.eth the rate of spaceship production is determined by the planet's fixed stats. If players were allowed to change this with some hooks they could install on their planets, or through other means, surely they would min-max it to their advantage.

You could of course imagine a law of balance in the game that ensures any increase in power in a certain area comes with an equivalently powerful decrease in another area. This is of course a difficult endeavor as any game designer can imagine.

But assuming such balance can be achieved and hooks are correctly designed then the hooks really become part of the gameplay and the balance systems do not really give place for the game to evolve beyond that. Its inputs are indeed now more complex and this can indeed offer a compelling gameplay but the hooks are then just that, more complex form of inputs.

We are genuinely interested to see games taking this approach and look forward to seeing how it plays out. [Playmint](https://playmint.com/) is exploring this with [Downstream](https://medium.com/@david.amor/digital-physics-in-on-chain-games-bab9e729936) and [Moving Castles](https://movingcastles.world/modular-and-portable-multiplayer-miniverses) with the Cursed Machine.

Having said that we think by its nature it limits what the world can evolve into. In such a context, the evolution paths are determined by the hooks and API. We believe the inherent composability of Autonomous worlds allow for more unexpected and interesting evolutions. These 2 approaches are not mutually exclusive though.

## Natural Composability

While we already emphasized that all on-chain games exposed a permissionless API, we did not yet mention how this could be used by the community to extend the game in unexpected ways. After all, how can you change the rules if they are immutable?

The solution requires a different perspective on what constitutes a game or world. Up to this point, our focus has primarily centered on the essential mechanics encoded within the blockchain, namely the code within the [smart contract](https://ethereum.org/en/smart-contracts/), its inputs, API, and the resulting rules. However, it's evident that a game or world encompasses more than just these technical elements.

**A game or world isn't confined solely to its code or smart contract; it comprises the code (i.e. the digital physics), the players, and their inputs, as well as the interactions among players themselves, the community. It's this very aspect that allows us to understand how such a world can be expanded with new, previously unimagined rules.**

The idea here is that while a game abides by some primordial immutable rules that define the possible set of its initial inputs, the game itself exists within a larger ecosystem—the realm of the players and the community. Therefore, even though the smart contract has predefined inputs, the game as a whole incorporates other forms of inputs that evolve alongside the player base and their interactions. And we can leverage this to let the game be permissionlessly extended.

We begin with a world featuring a fixed set of rules encoded in a smart contract. These rules and their associated input set remain unchangeable, as we defined earlier, giving the world its autonomy. However, new smart contracts can be built atop, similarly to the basic form of composability we mentioned earlier with marketplaces. But here these new smart contracts encode new rules that provide a new set of inputs and state data to players.

The new ruleset will of course not be able to alter the original smart contract, and so can only interact with it via the predetermined API. **The key element is that, by reading the state from the original game, the second game becomes influenced by what is happening in the first.** Consequently, players of the second game find themselves compelled to engage with players of the first ruleset.

In essence, a new game emerges, which is driven by player interactions, but in this case, it involves players from two smart contracts intricately intertwined.

Let’s explore this with the following diagram:

<p align="center">
<img style="padding-bottom:2em;" src="/images/blog/natural-composability.png" alt="Diagram explaining Natural Composability">
</p>

In the diagram, the game starts with the Genesis World and its accompanying immutable set of rules (RULE 0) that defines a set of input for players. But because of the social coordination required to play the game, the game really happens in the interaction among players (P1, P2, P3) and the ruleset/inputs defined by RULE 0. This is what the game is as a whole. This is our Genesis World.

Then anyone can build new rules like RULE 1, RULE N…, RULE M… These new rules are also immutable, but this time they derive their state not only from their own rules and inputs but also from the state derived from RULE 0. As such, players interacting with RULE 1 have an interest in also interacting with players giving inputs to RULE 0 (player P4) or even play with both rules (player P2).

From this new set of rules and players emerges an extended world with rules that did not exist when RULE 0 was put in place.

Now, because of the interactions among players across the 2 rules, they become intertwined. Even players interacting only with RULE 0 might consider looking at what is happening on layer above as the value of their action in RULE 0 is now affected by what becomes possible via RULE 1. An input that might have been almost value-less with RULE 0 alone, can be worthwhile with RULE 1.

And so at this point, even the "Genesis World" cannot be considered on its own anymore. It has been extended with a new set of rules and player's actions. **The world is now composed with rules never imagined beforehand and without any need for centralized coordination.**

::: info

This is a key point: with Natural Composability, contrary to fixed API/hooks driven composability as described in [Permissionless API](#permissionless-api), there is no need for the game creator to design the set of input and API capabilities or to pre-imagine what and how the world is going to be expanded. This is completely up to the community which will simultaneously continue to evolve along with the world.

:::

Interestingly, the world/game can be expanded in multiple directions simultaneously, either from RULE 0 or from RULE 1, etc… all of this permissionlessly. As a whole (RULE 0,...N, M combined), the game/world evolves through the interactions among players and every interconnected rulesets.

Of course some of these rules might be less popular and their significance reduced. It's also possible that rules which were once widely embraced may gradually wane in significance over time. This is because the link between each ruleset is actually a social and incentive driven one, there is nothing that force players to use one rules or the other. The world will thus continue to evolve permissionlessly while each of the individual rules remains immutable.

It is actually reminiscent of the first foray in composability we could see in early 2018 with [cryptokitties](https://www.cryptokitties.co/) derivatives. Of course the potential there was limited but games like [KittyRace](https://web.archive.org/web/20220124085427/https://kittyrace.com/) (or even [KittyHats](https://web.archive.org/web/20230602170539/https://kittyhats.co/#/)) affected the value of cryptokitties by giving some traits new utilities that did not exist before. This is also what underpin the [Loot ecosystem](https://www.lootproject.com/), where an asset can have multiple utilities across an ever expandable set of experiences.

We could even argue that the mechanism of Natural Composability actually permeates our experience in crypto with all the different mechanisms used by various projects to build upon existing communities and capital. In DeFi this includes [vampire attacks](https://finematics.com/vampire-attack-sushiswap-explained/), or more complex scenarios like seen in the [Curve wars](https://every.to/almanack/curve-wars) where projects create new incentive structures that shape the overall ecosystem in unexpected ways.

The main difference is that with fixed assets like Cryptokitties, Loot and Defi, the exposed data is rather limiting and the potential for composability remains relatively inconsequential. With Autonomous worlds, the sky's the limit. The extensions are now affecting whole worlds, their ruleset and their inhabitants altogether. From them emerge new affordances that keep worlds and their communities alive.

## [Stratagems](https://stratagems.world): Harnessing Natural Composability

<p align="center">
<img style="padding-bottom:2em;" src="/images/blog/stratagems-screenshot.png" alt="Stratagems's screenshot">
</p>

We call this "Natural composability" because every Autonomous World has it whether they want it or not, and no particular entity has control over it.

Having said that, we believe that worlds/games benefit in being designed from the start with the potential composability in mind and we are exploring this with our new game: [Stratagems](https://stratagems.world).

In Stratagems, players are gods, they can create islands in an endless sea and pick a faction to inhabit that land. This creates potential conflicts with the other players/gods and it is that conflict that underpins the potential reward as for each Island player risks an amount of [ETH](https://ethereum.org/en/get-eth/) that others can capture.

The way it works is that each island has a defense value corresponding to the number of friendly neighbor islands and it needs to exceed the number of enemy neighbors to keep being maintained. In other words, an island is either gaining life (more friendly neighbors than enemy neighbors) or losing life. Let's call these 2 states: prosperous and deteriorating.

Being in a deteriorating state for long enough, the island dies and the reward goes to the attackers. Reversely if the island is prosperous long enough it can reach its final state and become indestructible.

This ruleset, let’s call it RULE 0, gives a certain number of data point that Stratagems exposes:

- Island owner
- Island prosperous/deteriorating state
- Island dead/alive/final state
- Time at which each changes happen

This state can then be used by extensions in any way they like. For example, one new ruleset (RULE 1) can be that anyone is able to build on any island along with a deposit and when the island is in a prosperous state, it produces more. Producing could be units that players then use to conquer others or anything you can imagine. Note that none of this affects (nor can it) the primordial island rules (RULE 0).

But this new set of rules will in turn give these potential new players incentives to ensure the island remains prosperous. They might need to engage with players from RULE 0 or even play with or against them in order to maintain the island they use. Remember though that the island state is entirely defined by what happens in the original ruleset. The new set of rules just happen to read that state, creating a one way dependence.

Furthermore, the owner (the god placing the initial deposit and the associated island as per RULE 0) can be rewarded by having the new rules adding a tax for unit production for example. This would in turn incentivize such players to help make sure the island remains prosperous so that players playing RULE 1 uses their land so they can be taxed. This new ruleset would be creating a two-way relationship as a result, where players of the first rule set have interests in participating in the new ones.

From this new set of rules (which cannot modify in anyway the original ones) emerges an extended world that bring players of both ruleset to interact in new ways not envisioned beforehand

## Conclusion

What was described above about [Stratagems](https://stratagems.world) is just an example but hopefully helps illustrate the powerful aspect of **Natural Composability**.

We believe this mechanism of composition will be a core part of many new games that embrace immutability and become Autonomous Worlds.

The reasons are multiple but as can be seen from the Autonomous World community (see [survey](https://medium.com/@syora/the-survey-of-the-definition-of-autonomous-world-30407d07895a), [articles](https://aw.network/) and [twitter](https://twitter.com/search?q=%23AutonomousWorld)) there is a strong enthusiasm toward composability and we believe this actually stems from an inherent understanding of “Natural Composability” by its members.

**This is because as we alluded earlier, it permeates our experience in crypto** with for example the “battle for liquidity” seen in [Curve wars](https://every.to/almanack/curve-wars) or the various “[vampire attacks](https://finematics.com/vampire-attack-sushiswap-explained/)”, as well as many of the [Loot](https://www.lootproject.com/) derivatives and other incentive mechanisms for capital and community capture that exemplify the power of communities and their role in shaping the future of a protocol beyond its initial immutable code.

All of these existing examples only scratched the surface though and when such composability is built upon worlds with meaning that extends beyond the simple exchange of value, then we can start to imagine a far more exciting picture of world building. Communities will form around these worlds and push them towards unexpected and fascinating directions according to their intrinsic desire to co-build, and hopefully not just for the extrinsic rewards as seen in DeFi.

Furthermore, contrary to basic logic hooks and predefined API mentioned in [Permissionless API](#permissionless-api), Natural composability does not impose any limit or guidelines on how the world can be expanded. **Natural Composability literally enables infinite possibilities for Autonomous Worlds and, almost magically, it does so without centralized coordination nor permission required.**

If any of this has got your curiosity triggered, note that we are going to present that exact topic at the [Autonomous World Assembly in Istanbul](https://aw.network/2023).

In the meantime, feel free to get in touch. Let’s build worlds together!

You can join our [community on Discord](https://community.etherplay.io) and learn more about [Stratagems](https://stratagems.world)

---

_Special thanks to [Sylve](https://twitter.com/sylvechv), [Bohdan](https://twitter.com/TheLastTriarius), [Serena](https://twitter.com/SerenaTaN5/), [Playmint's team](https://twitter.com/PlaymintUK), [Killari](https://twitter.com/Qhuesten) and [Baz](https://twitter.com/_bazlightyear) for their review and feedback._

---

_This post can also be found on the [Etherplay website](https://etherplay.io/blog/natural-composability/) where you can find out more about games and tools we build._
