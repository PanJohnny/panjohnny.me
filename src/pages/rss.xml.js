import rss from '@astrojs/rss';
import {getCollection} from 'astro:content';

export async function GET(context) {
    const blog = await getCollection('blog');
    return new Response(await rss({
        title: 'PanJohnny’s Blog',
        description: 'Posts written by a guy doing coding for fun',
        site: "https://panjohnny.me",
        items: blog.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            customData: "<tags>" + post.data.tags + "</tags>",
            link: `/blog/${post.slug}/`,
        })),
    }).then(res => res.blob()), {status: 200});
}