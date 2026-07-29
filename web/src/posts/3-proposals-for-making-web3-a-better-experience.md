---
title: 3 Proposals For Making Web3 A Better Experience
date: 2018-10-12
mediumLink: https://medium.com/@wighawag/3-proposals-for-making-web3-a-better-experience-974f97765700
image: /images/blog/origin-encryption.png
titleImage: false
---

#### A.K.A. The Case For Automated Origin Checks And Non Interactive Signatures And Decryption

Security and usability are often described as being at the expense of one another. But the truth is, without security, you can’t claim to have usability: security issues will bite your users at some point.

Similarly without usability you run the risk of pushing users to make mistakes compromising their own security. A typical example is **authorization fatigue** where users get asked too many times to confirm actions that in some contexts have very little importance, pushing them to blindly accept any such authorizations, **including the important ones**.

In the end both of these concepts goes hand in hand. I would like here to explain 3 related proposals, 2 of which I wrote as part of several [**ethereum**](https://ethereum.org) [**EIP**](https://eips.ethereum.org) discussions that might not have been explained well enough. I would like here to try to explain the reasoning behind them and why they increase both security and usability and why **we should implement them in web3 browsers today**. Lastly, I bring forward a new proposal to [**EIP712**](https://github.com/ethereum/EIPs/pull/712) to reduce authorization fatigue for **when the signed messages in question carry little risks for the user in the context of a trusted application allowing a much nicer user experience**. If I explained the proposals properly you should fall in love with them. For those not familiar with web3, have a look [**here**](https://blog.stephantual.com/web-3-0-revisited-part-one-across-chains-and-across-protocols-4282b01054c5) and [**there**](https://blog.bigchaindb.com/blockchain-will-usher-in-the-era-of-decentralised-computing-7f35e94af0b6).

# document’s origin

The key to understand these proposals is to understand how web3 applications’ front-ends interact with the user through an origin. This concept is borrowed from the web and relates to the same-origin policy implemented in all web browsers. See [**https://tools.ietf.org/html/rfc6454**](https://tools.ietf.org/html/rfc6454)

To summarize, the origin of a document designates from where it was fetched (in the traditional web this is the domain name, protocol, port number…). And such origin is used to allow or refuse access to data meant to be used solely by one or a set of specified origins. In practise, a document from a particular origin is only allowed access to data put by a document of the same origin. This way one website cannot read or write data created by another website. It is used to allow documents from the same origin access to cookies and local storage for example and, that **without requesting authorization from the user** (you would not like it otherwise, trust me). **This automatism is possible because the browsers can check the origin of a document by itself without user input.**

The origin guarantee is based on DNS security since the origin is usually set to be a domain. This require both trust in the overall DNS system and in the domain owner to not change the application’s content and logic at whim. On web3 though, we can now consider [**IPFS**](https://ipfs.io) or [**SWARM**](https://swarm-gateways.net/bzz:/theswarm.eth/) hashes for example as origins, **providing a much stronger origin guarantee** that forbids the application’s owner to even change the application’s content and logic without also changing the origin. This is because with IPFS and SWARM (or other content-addressable networks) the origin itself encodes the hash of the content. **As such web3 browsers can ensure that the content they fetched belong to the specified origin since changing the content would result in a different hash and thus origin.** Care need to be taken by web3 browser though when such contents fetch non verifiable contents themselves (a.k.a. mixed content, a term also used for when https website fetch http content).

# Proposal 1: Non-Interactive Decryption

While the web’s same-origin policy and its use in cookies and local storage is a very useful mechanism to protect data pertaining to an application, it does not facilitate what is now common : multi-devices use of applications. With web3 and the upcoming encryption methods (see [**#130**](https://github.com/ethereum/EIPs/issues/130) and [**#1098**](https://github.com/ethereum/EIPs/pull/1098) as well as [**here**](https://ethereum-magicians.org/t/the-ux-of-eip-1024-encrypt-decrypt/1243) and [**there**](https://ethereum-magicians.org/t/eip-1024-cross-client-encrypt-decrypt/505) for the latest discussions (thanks [Dan Finlay](https://medium.com/@danfinlay)) we will now have the possibility to support freely movable secure storage. The actual storage location won’t matter since it can now be encrypted and thus data will be able to be safely synced across devices.

Now, it is true that an application could encrypt data with the user public key so only the user could decrypt it. Unfortunately without automated origin checks like the web provides, a malicious app could also request such decryption and **in order for the web3 browser UI to provide information to the user about where the encrypted data came from in the first place, the data in question would need to encode in some way its own origin**. Web3 browsers could then provide a pop-up with clear indication. Unfortunately this would provide a less than ideal user experience.

Indeed, this means every time applications want to read back encrypted data, they would require the user to confirm a pop-up. This could lead the users to compromise their own security as a result of authorization fatigue **and the users shouldn't actually need to authorize access when the data in question was created by and for one particular origin**.

Imagine having to confirm for every cookies before websites can get access? You will soon accept every such request blindly. **You might have already experienced a variation of this with websites that want to track you but want to remain GDPR compliant.**

The non-interactive decryption proposal (described first [**here**](https://github.com/ethereum/EIPs/issues/130#issuecomment-329770999)) basically allows applications to encrypt and **decrypt data** on user’s behalf in a similar way that the web provide access to local storage and cookies. Now though since the data is encrypted, it can be synced safely across devices and that **without user confirmation required.** Indeed, it means the users will **not** be asked to confirm decryption when the origin matches the one used for encryption. **After all if the application was responsible for the encryption, if it was indeed malicious, it would already have access to the decrypted data anyway.**

# How does it work?

As mentioned in the [**EIP comment**](https://github.com/ethereum/EIPs/issues/130#issuecomment-329770999), the idea is to add the origin (actually the origin(s) allowed to decrypt) as part of the data to be encrypted. This way when requesting decryption, the web3 browser can first inspect internally (by decrypting it) such origin(s) and if it matches the origin of the document requesting decryption, it can reveal the data to the application. On the other hand **if the origin does not match, the web3 browser will refuse to pass the decrypted data to the malicious application**. See below for a flow diagram explaining the web3 browser’s role:

![encryption with origin](../../images/blog/origin-encryption.png)

Decrypting data (note that the approval flow (highlighted in red) is very risky for the user and extra care should be taken to ensure the user is aware of what they are doing)

Note that if a user would like to transfer access to private data from one origin to another, we could accept cross-origin requests but these will be guarded by clear user authorization. The new data will then be encrypted with the new origin and the user can continue using that new application.

Alternatively, especially for when one application (served via IPFS hash for example) want to upgrade to a new hash/origin, the previous version could have a mechanism to encrypt data for a future origin, allowing such transition without user authorization, **apart obviously from the application’s own confirmation UI.** As a result a trusted application can provide a far better user experience, asking for confirmation only when updating the application’s content and logic.

# Proposal 2: Automated Origin Checks For Signatures

There has been tremendous progress on “security via clarity” for web3 based signature with the introduction of [**EIP712**](https://github.com/ethereum/EIPs/pull/712) and when looking at that proposal a while back, I realised the “origin” concept (used in the automated decrypting scheme mentioned above) could also be used there to add extra security. See original comment [**here**](https://github.com/ethereum/EIPs/pull/712#issuecomment-330501545).

In particular it would protect users from signing data belonging to another application without them realising it:

Imagine one application, let’s call it “Alice’s app” that allow users to transfer high-value tokens. Imagine then another application (a fun but malicious one), let’s call it “Bob’s app” whose smart contract use EIP712 with a very similar structure than “Alice’s app” but different enough to reassure the user that it does not match such app and cannot affect the tokens the user owns on “Alice’s app”. Now Charles, a user accustomed to “Alice’s app” discover “Bob’s app” and starts using it for a while. He start to get accustomed to the EIP712 signing po-pups and start to care less as the app does not have much value to him, except for the fun experience it provides.

But then, one day, the malicious app, change the signing request to match “Alice’s app” scheme exactly in order to steal some of Charles token pertaining to that app. While Charles should be able to notice the difference (since he would have never interacted with “Bob’s app” if the signing pop-up show information exactly like “Alice’s app” to begin with), **its** **acclimatization to “Bob’s app” could result in him accepting the signature by mistake.**

(Note that this same vulnerability applies to “chainId” too which should also be checked by web3 browser. “ChainId” cannot be accessed on the EVM though, see this [**proposal**](https://github.com/ethereum/EIPs/pull/1344) as an attempt to fix the situation)

While, as you can see in the [EIP discussion](https://github.com/ethereum/EIPs/pull/712), the proposal as described actually led to some extra security added in the form of a **fixed domain separator.** Such scheme though, relies on the user being aware and accustomed to read carefully what it is signing **all the time**. A malicious application as described above could deliberately make the process so frequent that the user get used to accept confirmations blindly in the the context of that application. This is what **‘authorization fatigue’** is about.

An automated origin field on the other hand would make such malicious use **impossible** regardless of users’ attention **since the origin check would be automated**. **Applications would only be able to sign on users’ behalf when the origin added to the data to be signed matches their own origin.**

At that time, I was missing the time to look at the proposal in details but thought with some relative confidence that the “origin” concept will be considered and be part of the standard, especially as one commenter added a well received clarification (see [**here**](https://github.com/ethereum/EIPs/pull/712#issuecomment-364495160)). As it turns out though, the proposal as it stand did not add such extra security scheme. I strongly believe we should not approve such proposal without it. This section hopefully clarify why. While there are web3 signer already implementing the current version of EIP712, this should not block us from rejecting its current version as a standard. Let’s aim for the long term.

# How does it work?

Upon signing, the origin (could be the hash of the origin) is inserted as part of the message to be signed. The web3 browser then verify that the specified origin match the current document’s origin. The web3 browser can accept a wild-card origin though (by the application simply omitting it) for the verifiers (smart contracts) that don’t want their users to pay for extra transaction data and or have no use at all for the extra security or simply because the context of the application has no place for a document’s origin.

See the following flow diagram that show what web3 browsers are supposed to do:

![eip712 origin](../../images/blog/eip721-origin.png)

Signed origin flow for the web3 browser (note the path highlighted in red is when no origin is provided, acting like a wildcard. This is potentially risky for the user and extra care should be taken to ensure the user is aware of what they are doing)

The verifier (for example a smart contract) would then be given the signed message and verify the signature the same way as EIP712 currently does. Except this time the data could include the origin in which case the verifier will verify if that particular origin has been approved (by the user) before hand.

A contract would then have a dynamic set of authorized origins per user. This would allow users to accept or reject origins as they interact with different application front-ends. **This provide a built-in mechanism for per application approval.** The following flow diagram show how a verifier / smart contract could accept extra origins via application/user’s request.

![origin verifier](../../images/blog/eip721-origin-verifier.png)

When an application want to request the user to approve its document’s origin

Let’s imagine one smart contract built by team A. That same team decide to specify the origin of their application front-end at IPFS hash “QmTkzDw…” to be one of the pre-approved origin from the get go (irrespective of user approval). Note that this is probably best practise for smart contracts to have **no** pre-approved origins. For that example though, this would allow the users to be able to start signing messages for that smart contract without any extra step before hand **when and only when navigating through that application’s pre approved origin**. Now if the origin check is part of the smart contract, no other applications could request valid signatures from the users. **As such the smart contract for interoperability purpose would need to allow the users to approve more origins.**

This way, team B could create a competitor front-end for the smart contract by first requesting the users to approve the team B’s front-end’s origin on the smart contract (as shown in the flow diagram above). When executing such method the smart contract would add such origin to the approved list. After that, a signed message with such origin field requested from the user will be accepted.

An implementation of EIP712 adding an optional origin check can be found here : [**https://github.com/wighawag/eip712-origin**](https://github.com/wighawag/eip712-origin) and see the following flow diagram that show the verifier expected behaviour:

![eip712 origin verifier](../../images/blog/eip721-origin-verifier-2.png)

The flow for the verifier. The path in red indicates a verifier that do not check origin and accept wildcard origin signatures. This is vulnerable to the authorization fatigue attack mentioned in the article

# Important note on the different type of origins

While it might not be of the scope of the EIP712 proposal to define what are valid origins. **I would suggest web3 browser to warn users when domain names are pointing to IP or other origins that do not provide a mechanism by which the browser could check their validity, and favour content-addressable origin like IPFS and SWARM as the way forward**. **It is also worth pointing that if such verifiable content is mixed with non-verifiable content, a warning should also be present.**

Furthermore, while it could be tempting to support [**ENS**](https://ens.domains) names as trusted origin, I would argue that since the entity in control could change its underlying registered URI at whim, the web3 browser should enforce the origin field to match the registered URI (hash) under that name and not the ENS name itself. This way when the owner of the ENS name change the registered URI, t**he users would be protected by first needing to approve the new hash**. The applications’ front-end could obviously facilitate the transition by letting the user know of the underlying change before hand.

# Proposal 3: Non-Interactive Signatures

Proposal 2 actually allow an even more interesting usability feature. Indeed, **the automation of origin verification can actually allow seamless signature generation**. I can predict that this proposal will be more difficult to digest since it breaks a common conception that user private key **is** the user and that no automatism should allow the use of private keys without user’s consent. As I ll show, the extra convenience could mean a lot for some applications and since it can be ignored by others, I **highly recommend implementing such scheme as part of EIP712 on top of Proposal 2** to push adoption of such standard in web3 browsers and let the application developers decide of its usefulness. This scheme can also alleviates some of the potential authorization fatigue resulting from signing messages with little consequences.

Indeed, if the origin is checked automatically via web3 browser as mentioned above, it means applications can now request signatures on user’s behalf **without permission** depending on the context. Yes, you heard me right. Similarly to the encrypted data as secure synced storage, we can imagine lots of use case / context where it would **not** make sense to ask authorization from the user for every actions that require users’ signatures on top of the existing front-end’s UI.

Imagine a decentralised social platform where the application’s front-end provides a form with text input and a submit button. It would be for many use cases too much for the users to confirm via an extra scary pop-up after they already pressed the “submit” button. Especially if it is to change some basic information that the users care at minimum. Furthermore, in these cases, the application developer would have actually no incentives to maliciously update such information unless they want to loose their users. Remember that because the origin is checked, such application’s origin would have to be approved by the users first anyway. And if the content of such origin is verifiable (IPFS, SWARM), the source code could be audited to ensure that no malicious behaviour is even possible.

This is of course application/context specific but this is a decision made on the smart contract (or whatever is in charge of taking action based on the signed messages) and as such **does not pose risks on the applications / smart contract which want to require user confirmation**. They just need to refuse signatures that have been signed without confirmation.

In my opinion, such scheme will increase security by removing most of the non-important authorization requests that otherwise would have increase users’ authorization fatigue.

# How does it work?

The key idea is to add an extra bit (byte) to indicate that the message was signed non-interactively (without user’s authorization). Of course as you can imagine, such signed messages won’t be accepted for every use cases but **this scheme let the verifier decide.**

**Note though that such non-interactive signature requests make sense only if we have automated origin checks.** Without such automated checks, any application would be able to sign any other application’s non-interactive messages on user’s behalf.

See the following flow diagram showing the expected behaviour of a web3 browser:

![non-interactive signature](../../images/blog/non-interactive-signatures.png)

flow for web3 browsers that allow non-interactive signatures (without user confirmation) only when origin is provided and checked. (note the path highlighted in red is when no origin is provided, acting like a wildcard origin. This is potentially risky for the user and extra care should be taken to ensure the user is aware of what they are doing)

The verifier (a smart contract for example) will then as usual hash the message using the domain separator and the origin, including the extra byte (indicating if user confirmation took place or not) and check if the signature matches the expected signer’s address.

If the smart contract considers that the “action” in question requires user confirmation, it can simply add the bit/byte that indicates the signature was generated via prior user confirmation. Then if the malicious application did actually submit a signature created without user confirmation, the resulting signature will not match (since the interactive bit was different) and the signature will be refused.

On the other hand for cases where the smart contract considers the action to be of less importance, it can accept an “interactive” boolean as part of the function call that indicate whether the signature was made without user confirmation or not and accept both cases. Note that because of the automated origin checks, the application would only be able to act maliciously if the user pre-approved its origin as mentioned above.

See the flow diagram below showing the expected verifier’s behaviour:

![non-interactive signature verifier](../../images/blog/non-interactive-signatures-verifier.png)

The flow for the verifier. The path in red indicates a verifier that do not check origin and accept wildcard origin signatures. This is vulnerable to the authorization fatigue attack mentioned in the article

An implementation of EIP712 adding the interactive byte / bit can be found here : [**https://github.com/wighawag/eip712-origin**](https://github.com/wighawag/eip712-origin)**.**

# Conclusion

As mentioned in the introduction, security and usability goes hand in hand. The post then showed that by enforcing origin checks by web3 browsers, we can not only provide stronger security but also a secure distributed storage without the need to request approval from the user. **Unfortunately we still need to wait for the web3 standard to evolve and add decryption and encryption methods**. I invite you to participate in the discussion to push for such methods as they are surely needed (see [**#130**](https://github.com/ethereum/EIPs/issues/130), [**#1098**](https://github.com/ethereum/EIPs/pull/1098), [**here**](https://ethereum-magicians.org/t/the-ux-of-eip-1024-encrypt-decrypt/1243) and [**there**](https://ethereum-magicians.org/t/eip-1024-cross-client-encrypt-decrypt/505)).

It also showed that by enforcing origins checks when signing messages (like in EIP712), we can protect users from malicious applications impersonating other applications by pushing the users to authorize blindly. It demonstrated the risk of authorization fatigue that origin checks prevent by letting the web3 browser checks on user’s behalf.

Lastly we showed an interesting use case of automated origin checks, that of **non-interactive signature**. These would allow applications that already have some confirmation UI (like a submit button) to **bypass the need for an extra scary looking web3 browser signing pop-up that should be reserved for important actions where the applications could have malicious incentive in screwing its user (funds for example).**

Of course as mentioned such scheme is not for everything since it relies on the user trusting the application’s front-end in question. But for those case where a signature is used for minor changes, the gain in usability would bring extra security by reducing authorization fatigue.

It also worth noting that the combination of encryption with non-interactive signature + non-interactive decryption allows applications to read and write on authenticated storage without user input. Such **storage provider would then be able to safely compartmentalize storage between each user/origin pair since it can authenticate requests of storage based on the signed encrypted data.** What we need now is a decentralised storage that would support such authenticated storage request.

The work done on [**3box**](https://github.com/uport-project/3box-js) by [**UPort**](https://www.uport.me) with [**orbit-db**](https://github.com/orbitdb/orbit-db) could be a possible solution that would greatly benefit from the automated decryption and signature scheme mentioned above, removing the need for users to keep authorizing access and thus improving greatly the overall experience.

This has been a long post and I hope this had made my proposals a lot clearer than the ones spread over the EIP discussions. Let me know what you think.

I ll be coming to the [**web3 summit**](https://web3summit.com) and [**devcon 4**](https://devcon4.ethereum.org) and would love to chat about such proposals. I ll be at the ethereum magicians’ [**council of Prague**](https://ethereumevents.global/events/2018-council-of-prague/) so find me there and let’s improve the state of usability and security for the web3 ecosystem together.

Thanks for reading.

Don’t hesitate to follow me on [twitter](https://twitter.com/wighawag).
