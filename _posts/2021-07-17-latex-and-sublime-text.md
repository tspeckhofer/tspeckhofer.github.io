---
layout: post
title: "LaTeX and Sublime Text"
subtitle: "An efficient LaTeX setup with autocomplete snippets and Vim navigation"
background: "/img/background.jpg"
typora-root-url: ".."
---

# $\LaTeX$ and Sublime Text

This tutorial explains how to use $\LaTeX$ in the text editor [Sublime Text](https://www.sublimetext.com/) and how to set up code snippets to write faster. For a general introduction to $\LaTeX$​​​​​​, see e.g. [this tutorial by Overleaf](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes). This setup is inspired by [this article by Gilles Castel](https://castel.dev/post/lecture-notes-1/), where a similar setup for Linux is described (using Vim as a text editor). On Windows, however, it is easier to set everything up in Sublime Text. _Remark:_ I have only tested this on Windows, but it should also work on Linux and macOS -- you just have to choose the correct PDF viewer in Step 1.

<center><img src="/img/2021-07-17-latex-and-sublime-text/LaTeX_Sublime_Text.png" width="100%"/></center>

**Contents:**

- TOC
{:toc}
---

## Step 1: Install the required software

- Install a $\LaTeX$ distribution. The most common ones are:

	- [TeX Live](https://www.tug.org/texlive/acquire-netinstall.html)
	- [MiKTeX](https://miktex.org/download)

	> The most important differences between TeX Live and MiKTeX are:
	> - TeX Live compiles significantly faster.
	> - MiKTeX can install packages used in a $\LaTeX$ file on the fly. However, if you choose the "full scheme" when installing TeXLive, all common packages are already included, and additional packages can be installed using the "TeX Live Manager". In this tutorial, we use TeX Live.

- Install [Sublime Text](https://www.sublimetext.com/3).

- On Windows: Install [Sumatra PDF](https://www.sumatrapdfreader.org/download-free-pdf-viewer.html). This is a PDF that automatically refreshes when the currently opened file is overwritten on the hard drive. (Many other PDF viewers do not even allow overwriting files that are currently opened!) If you are on Linux, you can use Zathura (`sudo apt-get install -y zathura`), and on macOS, you can use [Skim.app](https://skim-app.sourceforge.io/). [Here](https://latextools.readthedocs.io/en/latest/available-viewers/) you can find a list of all PDF viewers that can be used.

## Step 2: Set up Sublime Text as a $\LaTeX$ editor

- Install Package Control in Sublime Text: Press `Ctrl + Shift + P` and select `Install Package Control`. After the installation, restart Sublime Text.

- Install the required Sublime Text packages: In the menu bar, click on `Preferences - Package Control`. Then select `Package Control: Install Package` (see image below). Now you can search for available packages and install them. Install the following packages:
	- LaTeXTools
	
	- LaTeX-cwl (this package already contains some code snippets)
	
	- Optional: Install the color scheme "10% Too Dull for My Tastes". Afterwards, you can select the "scotchy - 10% Too Dull [...]" color scheme under `Preferences - Color Scheme...`. This color scheme is also used in the screenshots on this page.
	
	<center><img src="/img/2021-07-17-latex-and-sublime-text/Package_Manager.png" width="100%"/></center>
	
- Under `Preferences - Package Settings - LaTeXTools - Settings - User` change the line `"builder": "traditional",` to `"builder": "basic",` (including the comma at the end).

- Close and restart Sublime Text.

- Now you can open a `.tex` file in Sublime Text and press `Ctrl + B` in order to compile it (this also saves the `.tex` file). The generated PDF file is opened in SumatraPDF automatically. If something does not work as expected, you might find a solution [here](https://latextools.readthedocs.io/en/latest/install/).

> Some further tips:
>
> - Using `Windows key + left/right arrow`, you can position the currently active window in the left/right half of your screen, so you can see the $\LaTeX$ source code and the PDF output at the same time (like in the first screenshot). By double-clicking on a line in the PDF file, Sublime text automatically jumps to the corresponding line in the `.tex` file (this is called inverse search).
> - After compiling, you can press `Ctrl + L` and then immediately `Backspace` in order to clean the folder that contains the `.tex` file and delete all temporary files.

## Step 3: Set up snippets

This functionality is the main reason why I use Sublime Text as my $\LaTeX$ editor: You can define your own code snippets, which are replaced by $\LaTeX$​ commands automatically while you are typing (without even having to press an extra button!). On Linux, this [can be done directly in Vim](https://castel.dev/post/lecture-notes-1/), but on Windows it is more complicated to set this up in Vim (and I could not get it to work). In Sublime Text, however, it is straightforward:

- In order to use snippets, you have to go to `Preferences - Key Bindings` in Sublime Text and paste the contents of [this file](https://raw.githubusercontent.com/tspeckhofer/LaTeX_SublimeText/master/SublimeTextKeymap.txt) into the right column.
- If you do not use Vim navigation using the "Vintageous" package (see below), you can delete the first two snippets.
- Some useful commands that are not defined by default in $\LaTeX$ are also replaced automatically (e.g. `NN` is replaced by `\N`, which stands for `\mathbb{N}`, and there are a few additional commands where a backslash is added: `\lcm`, `\coker`, `\coim`, `\rot` and some arcus- or area functions, i.e. `\arcsec`, `\arsinh`, `\artanh`, ...). These commands are defined in my file [`Template.sty`](https://raw.githubusercontent.com/tspeckhofer/LaTeX_SublimeText/master/Template.sty), which can be copied to the folder that contains the `.tex` file and included by adding `\usepackage{Template}` to the preamble.
- Using the snippet `template[tab]`, where `[tab]` stands for pressing the `tab` key, a $\LaTeX$ template containing the most commonly used packages (partly by using `\usepackage{Template}`) can be pasted in an empty `.tex` file. You can also download a `.tex` file containing this template [here](https://raw.githubusercontent.com/tspeckhofer/LaTeX_SublimeText/master/LaTeX_Template.tex).
- You can find a list of all snippets [here](https://raw.githubusercontent.com/tspeckhofer/LaTeX_SublimeText/master/SublimeTextSnippetsList.txt).

> Here are some examples of snippets that are replaced automatically while typing:
>
> - `mk` is replaced by `$...$` (math mode).
>
> - `dm` is replaced by `\[ ... \]` with line breaks in between the square brackets (display-math mode).
>
> - `<=` is replaced by `\leq`, and `>=` is replaced by `\geq`.
>
> - `sr` (which stands for "squared") is replaced by `^2`, and `cb` is replaced by `^3` ("cubed").
>
> - `**` is replaced by `\cdot` and `xx` is replaced by `\times`.
>
> - `//` is replaced by `\frac{}{}`, the cursor jumps into the first curly brackets pair and you can use the `tab` key to jump into the second pair and to exit the brackets.
>
> - `iff` is replaced by `\iff`, `=>` is replaced by `\implies` and `=<` is replaced by `\impliedby`.
>
> - `bar` is replaced by `\bar{}` and the cursor jumps into the curly brackets pair (you can use `tab` to exit the brackets), `til` is replaced by `\tilde{}`, `wtil` is replaced by `\widetilde{}` and `wbar` is replaced by `\overline{}`.
>
> - `lr(` is replaced by `\left(  \right)` (and you can use `tab` to navigate), `norm` is replaced by `\|  \|` etc.
>
> - `NN` is replaced by `\N` (the set of natural numbers -- this command is defined in `Template.sty`), `ZZ` is replaced by `\Z`, `QQ` is replaced by `\Q`, `RR` is replaced by `\R` etc.
>
> - `UU` is replaced by `\cup` (union), `Nn` is replaced by `\cap` (intersection), `ww` is replaced by `\wedge`, `vv` is replaced by `\vee`, `uuu` is replaced by `\bigcup`, `vvv` is replaced by `\bigvee` etc.
>
> - Greek letters: `.a` is replaced by `\alpha`, `.b` is replaced by `\beta`, `.e` is replaced by `\epsilon`, `..e` is replaced by `\varepsilon`, `.G` is replaced by `\Gamma` etc.
>
> - `AA` is replaced by `\forall`, `EE` is replaced by `\exists`.
>
> 
>Thus, you can type for example `AA..e>0EEn_0innNNAAn>=n_0: normx_n - x[tab]<..e` (where `[tab]` stands for pressing the `tab` key), and without pressing any other keys, this is replaced by
> 
> ~~~latex
> \forall \varepsilon > 0 \exists n_0\in \N\forall n\geq n_0: \| x_n - x \|<\varepsilon
> ~~~
>	
> Thus, a lot of time can be saved by remembering and using these snippets!

## Step 4: Set up Vim navigation

Another system that can speed up writing in general is Vim navigation in Sublime Text. Actually, [Vim](https://www.vim.org/) is a text editor on its own, and there are keyboard shortcuts for navigation, copying and pasting text, selecting parts of a text (or a whole line), jumping to the beginning or end of a line or file etc. However, there is also a package for Sublime Text called "Vintageous", which enables you to also use these shortcuts in Sublime Text.

### Installation

Simply open Package Control in Sublime Text and install the package "Vintageous".

### A short introduction to Vim

#### Command mode

By default, you are in "command mode". It is called "command mode" because you can type commands after pressing `:` (which will open a small command line). For example, by typing `:w` and pressing `Enter`, you can save a file. You can close a file with `:q`, save and close using `:wq` and close without saving with `:q!`. (But of course, in Sublime Text, you can still use `Ctrl + S` in order to save a file.) Furthermore, command mode you can navigate in your file using the `h`, `j`, `k` and `l` keys instead of the arrow keys. Thus, you never have to move your hand away from their "default" position on the keyboard in order to use the arrow keys or the mouse, which saves much time!

There most important commands are:

- `j` = move cursor down by one line.
- `k` = move cursor up by one line.
- `h` = move cursor left by one position.
- `l` = move cursor right by one position.
- `w` = move cursor to the beginning of the next word.
- `b` = move cursor to the beginning of the previous word.
- `[number n] + [one of the previous commands]` = execute this command `n`-times, e.g. move cursor `n` words to the right.
- `0` = move cursor to the beginning of the line.
- `$` = move cursor to the end of the line.
- `gg` = jump to the beginning of the file.
- `Shift + G` = jump to the end of the file.
- `zz` = center view at the current line.
- `zt` = change view so that the current line is at the top.

#### Insert mode

By pressing the `i` key, you can enter the "insert mode", in which you can write as usual. The text that you write will be inserted _before_ the current cursor position. You can press `Esc` to return to command mode. In my key bindings for Sublime Text, you will also find the commonly used combinations `jk` and `kj` to return to command mode. Since the order does not matter, you can simply press `j` and `k` at the same time to return to command mode. Apart from `i`, you can also press the `a` key to enter insert mode, but then the text that you write will be inserted _after_ the current cursor position. Finally, you can press `Shift + I` or `Shift + A` to enter insert mode and append text at the beginning or at the end of the line, respectively, and you can press `o` or `Shift + O` to open a new line below or above the cursor, respectively, and enter insert mode.

#### Visual mode

If you press `v` in command mode, you will enter the "visual mode". Here you can select parts of the text. The selection begins at the position, where you entered visual mode, and you can edit the end of the selection by navigating like in command mode. You can copy the selected text by pressing `y`, or you can cut it by pressing `x`. Then you will return to command mode, and by pressing `p` or `Shift + P`, you can paste the text after or before the cursor position, respectively. Finally, you can undo the last change by pressing `u` in command mode.

You can find a more detailed explanation of Vim [here](https://www.tutorialspoint.com/vim/vim_quick_guide.htm).
