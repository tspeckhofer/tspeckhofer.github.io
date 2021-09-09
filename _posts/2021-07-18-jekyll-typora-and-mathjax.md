---
layout: post
title: "Jekyll, Typora and MathJax"
subtitle: "A tutorial that explains how this website was created."
background: "/img/background.jpg"
typora-root-url: ".."
---

# Jekyll, Typora and MathJax

The purpose of this post is to explain how this whole website was created. The setup is based on [https://www.youtube.com/watch?v=wCOInE7-E0I](https://www.youtube.com/watch?v=wCOInE7-E0I). I recommend using [GitHub Pages](https://pages.github.com/) to host your Jekyll page, but of course, there are also other options. For simplicity, I will assume that you want to create your Jekyll website in a folder called `[...].github.io` (e.g. after cloning your `[...].github.io` repository to create a local copy on your computer).

---

**Contents:**

- TOC
{:toc}
---

## Install Jekyll and mak a Jekyll blog/website

- Go to [this page](https://jekyllrb.com/docs/installation/windows/) and follow the instructions to install Jekyll.

- Now you have two options to make a Jekyll blog/website:
  1. Go to [this page](https://jekyllthemes.io/theme/startbootstrap-clean-blog-jekyll) and click on "Get Clean Blog on GitHub". This leads to [a GitHub repository](https://github.com/StartBootstrap/startbootstrap-clean-blog-jekyll). Clone/download everything to your `[...].github.io` folder. You can also use another template, but then some file and folder names may be different from the names in these instructions.
  2. Simply clone or download [my repository](https://github.com/tspeckhofer/tspeckhofer.github.io) containing the website you are currently reading.

- Edit `_config.yml` to configure the general settings for the blog. You can edit your website e.g. in [Visual Studio Code](https://code.visualstudio.com/): If you click on `File - Open Folder` and choose the whole `[...].github.io` folder in VS Code, you will have a clearly laid out file tree and you will be able to edit all the different files in one editor.

- Open a terminal/command prompt in your `[...].github.io` folder and execute the commands `bundle install` and then `bundle add webrick` and `bundle exec jekyll serve`. Then, if everything worked, it should display something like:

  ~~~
  Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
  ~~~

  Now you can view the website in your browser at `localhost:4000` (where `4000` has to be replaced by the port at the end of the "server address"). Generally, you will not need to run the command every time you change something on the website or add a new post, but it may be necessary to do so e.g. after changes in the `_config.yml` file. Otherwise, it suffices to reload the page in the browser. You can also make a `.bat` file containing
  ~~~
  cmd /k bundle exec jekyll serve
  ~~~
  so that you do not have to remember the command (and using `cmd /k`, the cmd window does not close after stopping the server). Your website will be generated in the `_site` folder, but you will not have to upload this folder to GitHub, because instead, the files in the `_posts` folder will be used on GitHub in order to generate your website. Therefore, a `.gitignore` file containing the `_site` folder (and some other files) is generated automatically in your `[...].github.io` folder.

## Markdown

[Markdown](https://en.wikipedia.org/wiki/Markdown) is a markup language that is used to create formatted text in a plain-text editor. This means that you can simply write plain text files (which are usually saved with the extension `.md`) containing special syntax for formatting. It is used to write websites, blog posts, documentations and even books (and of course, everything on this page was written in Markdown). Markdown files can be exported to other formats like HTML or PDF. But unlike HTML, you do not need "ugly" tags like `<h1>Heading</h1>`, and so the text will also be clearly readable in any plain text editor. Here you can see an overview of the most important Markdown syntax (ignore the line breaks after line 7, 8 and 35, 36 -- they are just there so that everything can be displayed at once in the code block):

~~~markdown
# This is a level 1 heading.

## This is a level 2 heading ...

###### This is a level 6 heading.

This is a normal paragraph. You can write **bold** or
_italic_ (or *italic*) text, and it is also possible to write
`inline code`. Furthermore, you can create unnumbered lists:

- first item
- second item

and numbered lists:

1. an item
2. You can always use the number 1 for automatic numbering:
	1. item one (will be displayed as: "1. item one")
	1. item two (will be displayed as: "2. item two")
	1. item three (will be displayed as: "2. item three")

> This is a block quote. This is a link: [link text](some-url.com)

The following will be displayed as a horizontal line:

---

You can make tables (better use a Markdown editor for that):

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| a        | b        | c        |
| This     | is a     | table. |

If you are using GitHub Flavored Markdown (which will be
possible in this setup), you can also use fenced code blocks
and specify a language for syntax highlighting:

​~~~python
print("hello world")
​~~~

~~~

For more details and commands in Markdown, you can read [this page](https://guides.github.com/features/mastering-markdown/), [this page](https://www.markdownguide.org/basic-syntax/) and [this page](https://support.typora.io/Markdown-Reference/). You can also try out the online Markdown editors [Editor.md](https://pandao.github.io/editor.md/en.html) and [Dillinger](https://dillinger.io/).

## Typora

[Typora](https://typora.io/) is a very feature-rich and easy-to-use Markdown editor (and it is free during beta). You can download it [here](https://typora.io/#download). It is a "what you see is what you get" editor that can display all the elements described above (i.e. headings, links, tables, code blocks etc.), but there is also a "Source Code Mode". If you write `[TOC]`, Typora will generate a table of contents with clickable links automatically! There are also keyboard shortcuts -- you can press e.g. `Ctrl` and `+` or `-` in order to change the level of a heading -- and it is also very easy to make tables in Typora. Typora also supports $\LaTeX$ inline math and math blocks, and you can export to HTML, PDF and many other formats. Later we will discuss how to insert images (which will be copied to the correct folder in your Jekyll page automatically). Finally, Typora also supports normal HTML tags.

I suggest that you go to `File - Preferences` (or pressing `Ctrl + comma`) and have a look at all the settings. Under `Appearence`, you can click on `Open Theme Folder` and paste the file [mytheme_black.css](/files/2021-07-18-jekyll-typora-and-mathjax/mytheme_black.css) or [mytheme_blue.css](/files/2021-07-18-jekyll-typora-and-mathjax/mytheme_blue.css) into the theme folder. Then you can click on `Themes` in Typora's menu bar and choose the theme "Mytheme Black" or "Mytheme Blue" in order to get basically the same formatting in Typora as in my Jekyll page (e.g. using the Palatino font).

## Using Markdown files in Jekyll

Jekyll generates a blog using all text files of the form `YEAR-MONTH-DAY-title.md` (or `.html`) in the folder `[...].github.io/_posts`. Files with a future date will not be displayed on the page before that date. In order to use `.md` files for a Jekyll blog, they have to start with a YAML front matter block that sets the layout and other meta data, for example:

~~~yaml
---
layout: post
title: "Jekyll, Typora and MathJax"
subtitle: "A tutorial that explains how this website was created."
background: "/img/background.jpg"
---
~~~

### Table of contents

Instead of the usual Markdown command `[TOC]`, you have to write

~~~markdown
- TOC
{:toc}
~~~

in order to create a table of contents that is recognized by Jekyll. If you do not want bullets in the table of contents, add the following lines to the file `assets/vendor/startbootstrap-clean-blog/scss/_global.scss` (or `assets/main.scss`), which also adjusts some other CSS settings:

~~~scss
// Table of contents:
#markdown-toc {
	list-style-type: none;
	padding: 20px;
	background-color: #f8f9fa;
	border-radius: 6px;
}
#markdown-toc * {
	list-style-type: none;
}
~~~

### Images

In the `_posts` folder, only the files containing the actual posts are used by Jekyll, and all other files or folders are ignored. Thus, if you want to add images to a post, the best option is to copy all images into another folder, e.g. `[...].github.io/img`. Now add the following line to your YAML header:

~~~yaml
typora-root-url: ".."
~~~

This will change the Typora root url to your `[...].github.io` folder instead of `[...].github.io/_posts`. Now you can e.g. include the background image `/img/background.jpg` by typing `![background](/img/background.jpg)`. In order to change the size, alignment etc. you can use HTML commands like

~~~html
<center><img src="/img/background.jpg" width="70%"/></center>
~~~

instead. It is also a good idea to go to `File - Preferences... - Image` in Typora and change `When Insert` to `Copy image to custom folder` and type `../img/${filename}`. Now you can drag and drop any image into a file opened in Typora, and it will be copied to `/img/[filename]` automatically.

> _Remark:_ You may have to click into the line `typora-root-url: ".."` once after starting Typora so that the root url is updated and the images are found.

## Customization

**Note: If you have cloned [my repository](https://github.com/tspeckhofer/tspeckhofer.github.io), you will not need the steps described in this chapter -- everything should work out of the box. Nevertheless, I recommend reading them in order to find out how to customize all the settings yourself!**

Generally, you can edit all the SCSS files in the `assets` folder or copy my files. I have modified e.g. the file `assets/vendor/startbootstrap-clean-blog/scss/variables/_typography.scss` in order to change the fonts and the file `assets/vendor/bootstrap/scss/_tables.scss` in order to change the style of tables.

### Syntax highlighting in code blocks

In order to use syntax highlighting in code blocks, first type `gem install rouge` in a terminal/command prompt. Alternatively, you can add

~~~ruby
# Rouge:
gem "rouge"
~~~

 to the file called `Gemfile` and then execute the command `bundle` in your `[...].github.io` folder to install Rouge. Next, open the `_config.yml` file, and after the line `markdown: kramdown` paste the following lines:

~~~yaml
kramdown:
  input: GFM
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    block:
      line_numbers: true
~~~

In your `assets` folder, make a Pygment CSS theme file called `highlight.css` (Rouge is compatible with Pygments's stylesheets). You can choose a theme from [https://github.com/jwarby/jekyll-pygments-themes](https://github.com/jwarby/jekyll-pygments-themes) and paste the contents into your theme file. I am using the "github" theme. Finally, add the line 

~~~scss
@import "highlight.css";
~~~

to your `main.scss` file in the `assets` folder. You can edit the style of your code blocks in `assets\vendor\bootstrap\scss\_code.scss`, or you can just copy my `_code.scss` file.

### Task lists and checkboxes

In order to display checkboxes like in Typora, first add the following lines to `assets/vendor/startbootstrap-clean-blog/scss/_global.scss` (or to `assets/main.scss`):

~~~scss
// Task lists:
.task-list {
	padding-left: 8px;
}
.task-list-item {
	list-style-type: none;
}
.task-list-item-checkbox {
	margin-right: 18px;
	vertical-align: middle;
	pointer-events: none
}
~~~

Now the checkboxes will be displayed in the correct positions and without unnecessary bullets, but they will be disabled and thus greyed out. If you want them to have a normal black outline and blue background (like when you export to HTML in Typora), add the following command to the file `scripts.js` in your `assets` folder:

  ~~~javascript
  $(document).ready(function(){
  	$('.task-list-item-checkbox').prop("disabled", false); 
  });
  ~~~

Now the checkboxes will behave like in an HTML file generated by Typora: They will look like they are active, but the line `pointer-events: none` in `_global.scss` will disable all events when clicking on them (obviously, you can change that).

### MathJax

You can use [MathJax](https://www.mathjax.org/) by adding the following lines to the file `scripts.html` in your `[...].github.io` folder:

```html
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<script>
	window.MathJax = {
		tex: {
			inlineMath: [['$', '$'], ['\\(', '\\)']],
			tags: 'ams'
	}
};
</script>
```

Finally, add the following lines to `_global.scss` or `main.scss` in order to get obtain correct font sizes:

~~~scss
.MathJax {
	font-size: inherit !important;
}
~~~

Now you can write e.g. `$\int f(x)\,\mathrm{d}x$`, and it will be displayed as $\int f(x)\,\mathrm{d}x$ (and you can also use other MathJax features, such as numbered equations, cross-referencing etc.)
