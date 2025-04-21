<template>
    <div>
        <h2>최신 글</h2>
        <ul>
            <li v-for="post in posts" :key="post.url">
                <a :href="post.url">{{ post.frontmatter.title }}</a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { data as posts } from "../posts.data.mjs";
</script>
