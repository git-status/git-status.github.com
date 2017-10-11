---
layout: page
title: my github pasge
tagline: blogging on my git projects
---
{% include JB/setup %}

    
## git-status projects
  Project / Porfolio stuff.


Recent Posts list:

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>



## To-Do
  I probably will not fork the theme, it seems to be ok for my purposes.