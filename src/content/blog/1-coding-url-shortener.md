---
title: Coding URL shortener
description: How I coded url shortener with astro and mongodb atlas
pubDate: Mon, 16 Jan 2023 18:00:00
tags: [astro, url-shortener, mongodb]
---
In this post we will go over how I coded simple URL shortener.

## Creating database
First I needed to create database. I used [MongoDB atlas](https://www.mongodb.com/atlas/database), beaceuse they have free tier and it is easy to use and fast to setup.

After databse creation I saved my password into enviroment file and created utility script.

```js
import mongoose from "mongoose";

if (mongoose.connection.readyState != 1) {
    const login =
        "mongodb+srv://<name>:<password>@a.b.mongodb.net/?retryWrites=true&w=majority".replace(
            "<password>",
            import.meta.env.DB_PASS
        );

    mongoose.connect(login);
}


const ShortURLSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    isImage: Boolean,
    shorten: String
});

export const ShortURLModel = mongoose.models.ShortURL || mongoose.model("ShortURL", ShortURLSchema);
```

This allowed me to connect to the database.

## Api endpoints
For better security I require user to enter password. So I can only give my tool to someone I trust. The method I chose is bad and you should not use it. I plan to implementing some oauth2 flow.

`
/api/v1/login
`
```astro
---
const pass = Astro.request.headers.get("Password");

if (pass == import.meta.env.USR_PASS) {
    return new Response(import.meta.env.USR_SECRET);
} else {
    return new Response(undefined, {
        status: 401
    })
}
---
```

This paste solution is not much better either. But for personal use...

`/api/v1/paste`
```astro
---
import { ShortURLModel } from "../../../../db";

const secret = Astro.request.headers.get("Secret");
const badRequest = new Response(undefined, {
        status: 400
    });

    
let res:Response = badRequest;
await Astro.request.json().then((json) => {
    if (json["title"] && json["description"] && json["url"] && json["isImage"] != undefined && json["shorten"]) {
        new ShortURLModel(json).save();
        res = new Response(undefined, {
            status: 200
        });
    }
}, (err) => {

});

return res;
---
```
## Redirecting

This is simple code I use for redirecting. It is designed this way to fool web scraping robots (instant redirect won't show my custom title and description).

`/s/[short]`
```astro
---
const { short } = Astro.params;

import { ShortURLModel } from "../../db.js";
import Layout from "../../layouts/Layout.astro";

const found = await ShortURLModel.findOne({shorten: short}).exec();

if (!found) {
    return Astro.redirect("/404?source=" + Astro.url.pathname)
}
---

<Layout title={found.title} description={found.description}>

    {
        !found.isImage ? (
    <a href={found.url} id="url">Click here if not redirected</a>

    <script is:inline>
        setTimeout(() => {
            window.location.href = document.querySelector("#url").getAttribute("href");
        }, 100);
    </script>
        ) : (
            <a href={found.url}>
                <img src={found.url} alt="mirrored image" title="Click here to open original">
            </a>
        )
    }

    
</Layout>

<style>
    img {
        height: 100vh;
        width: auto;
    }
    body {
        align-content: center;
        display: flex;
        background-color: #0E0E0E;
        justify-content: center;
    }
</style>
```

## Creating control panel
I created simple control panel to add new endpoints. And I have no idea why I called it pasty, it sounded kinda funny ig.

`/pasty`
```astro

---
import Layout from "../layouts/Layout.astro";
---

<Layout title="Pasty" description="Generate urls when pasting stuff" theme="dark">
    <main class="container">
        <h1>Pasty</h1>
        <div>
            <h3>Title</h3>
            <input type="text" name="title" id="title" placeholder="Title" />
        </div>

        <div>
            <h3>Description</h3>
            <input
                type="text"
                name="desc"
                id="desc"
                placeholder="Description"
            />
        </div>
        <div>
            <h3>URL</h3>
            <input type="url" name="url" id="url" placeholder="URL" />
        </div>
        <div>
            <h3>isImage</h3>
            <input type="checkbox" name="img" id="img" value="off"/>
        </div>
        <div>
            <h3>Short</h3>
            <input type="text" name="short" id="short" placeholder="Short" />
        </div>
        <input type="button" value="Paste" onclick="pasteIt()" />
        <a
            href="https://cloud.mongodb.com/v2/61e087db89302530af2f22f1#/metrics/replicaSet/63b98d7ef0c6a01cb2d97b6f/explorer/test/shorturls/find"
            >Remove stuff here</a
        >
    </main>
</Layout>

<script is:inline>
    if (!localStorage.getItem("secret")) {
        const pass = prompt("This page requires auth, enter special pass.");

        // request login
        fetch("/api/v1/pasty/login", {
            headers: {
                Password: pass.trim(),
            },
        })
            .then((res) => res.text())
            .then((text) => {
                localStorage.setItem("secret", text);
            })
            .catch((err) => {
                alert("Invalid password");
                window.location.reload();
            });
    }

    function pasteIt() {
        const title = document.querySelector("#title").value;
        const desc = document.querySelector("#desc").value;
        const url = document.querySelector("#url").value;
        const isImage = document.querySelector("#img").value;
        const short = document.querySelector("#short").value;

        fetch("/api/v1/pasty/paste", {
            headers: {
                Secret: localStorage.getItem("secret"),
            },
            body: JSON.stringify({
                title: title,
                description: desc,
                url: url,
                isImage: isImage == "on",
                shorten: short,
            }),
            method: "POST",
        }).then(
            (success) => {
                if (success.ok) alert("Success!");
                else alert("Bad Request!");
            },
            (err) => {
                alert("Err!");
                console.error(err);
            }
        );
    }
</script>

<style>
    input {
        outline: none;
        font-size: 1em;
        border-radius: 5px;
    }
    h3 {
        display: inline;
    }
</style>
```

