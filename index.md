---
layout: page
title: ahoy githubbers!
tagline: blogging on my git projects
---
{% include JB/setup %}

    
## git-status projects
  I deleted sample data , now i'm ready to talk about some ideas 
  and technologies I"m interested in.


Recent Posts list:

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

## To-Do
  I probably will not fork the theme, it seems to be ok for my purposes.