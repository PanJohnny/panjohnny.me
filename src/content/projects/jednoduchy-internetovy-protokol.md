---
title: Jednoduchý Internetový Protokol
description: Custom aplication protocol for server-client communication
tags: [ java, api, school ]
links: [
  {
    title: "GitHub",
    url: "https://github.com/PanJohnny/JIPProtocol",
    icon: "mdi:github"
  },
  {
    title: "Dokumentace",
    url: "https://panjohnny.github.io/JIPProtocol/apidocs",
    icon: "mdi:file-document-box-multiple"
  },
  {
    title: "SOČ",
    url: "https://panjohnny.github.io/JIPProtocol/N%C3%A1vrh%20a%20implementace%20internetov%C3%A9ho%20protokolu.pdf",
    icon: "mdi:graduation-cap"

  }
]
---

Tato práce je součástí mé středoškolské odborná činnosti (SOČ) s názvem _Návrh a implementace internetového protokolu_. Zdrojový kód je k dispozici pod licencí MIT.

Ve zkratce se jedná o jednoduchý (ve smyslu jednoduše fungující) aplikační protokol na bázi klient-server, který využívá TCP. Projekt je naprogramovaný v Javě a využívá Socket a streamů pro komunikaci.

* Dokumentace: https://panjohnny.github.io/JIPProtocol/apidocs
* Středoškolská odborná činnost: https://panjohnny.github.io/JIPProtocol/N%C3%A1vrh%20a%20implementace%20internetov%C3%A9ho%20protokolu.pdf

Děkuji za přečtení a přeji příjemný den. Chcete-li se podívat na mé další projekty, navštivte můj [GitHub profil](https://github.com/PanJohnny). Alternativně na mých webových stránkách naleznete pár demonstračních ukázek a bližší info o mně. https://panjohnny.me

Pokud Vás tento projekt zaujal, nebo jsem Vás zaujal já určitě mě neváhejte kontaktovat, budu velice rád. Má emailová adresa je [janstefanca@seznam.cz](mailto:janstefanca@seznam.cz).
## Anotace
Tato práce se zabývá návrhem a implementací vlastního komunikačního protokolu mezi klientem a serverem. Práce se zaměřuje na vysvětlení základních principů přenosu dat, struktury paketů a procesu handshake, který je klíčový pro navázání šifrovaného spojení. Hlavním cílem je vytvořit jednoduchý, modulární a bezpečný protokol, který je prakticky využitelný a snadno pochopitelný i pro čtenáře bez hlubokých teoretických znalostí. Text obsahuje příklady implementace v jazyce Java a ukazuje, jak různé vrstvy protokolu spolupracují při zajištění efektivní a bezpečné komunikace.
## Annotation
This thesis deals with the design and implementation of a custom communication protocol between client and server. The work focuses on explaining the basic principles of data transmission, packet structure and the handshake process, which is crucial for establishing an encrypted connection. The main goal is to create a simple, modular and secure protocol that is practical and easy to understand even for readers without deep theoretical knowledge. The text includes examples of Java implementations and shows how the different layers of the protocol work together to ensure efficient and secure communication.