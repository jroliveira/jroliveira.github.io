---
layout: post
title: Jekyll no Windows 7
description: Blog pessoal com assuntos dedicados a desenvolvimento de software nas linguagens de programação C Sharp, Delphi, ASP .NET, PHP e Javascript.
date: 2015-09-27 00:51
comments: true
categories:
- desenvolvimento
- jekyll
tags: 
- jekyll
lang: pt
---

Olá pessoal, neste post eu vou explicar como instalar o Jekyll no Windows 7.

**Instalar o Ruby**

A versão que estou utilizando neste artigo é a [Ruby 2.2.3-x64][ruby].
Após baixar o arquivo, instale no caminho **c:\Ruby22-x64** e selecione a opção **Add Ruby executables to your PATH**.
Para verificar se o Ruby foi instalado corretamente, abra o powershell e execute o comando abaixo.

<!--more-->

```
PS C:\> ruby -v
ruby 2.2.3p173 (2015-08-18 revision 51636) [x64-mingw32]
```

**Instalar o DevKit**

A versão que estou utilizando neste artigo é a [DevKit-mingw64-64-4.7.2][devkit].
Após baixar o arquivo, instale no caminho **c:\RubyDevKit**.
Após instalar execute no powershell os comandos abaixo.

```
PS C:\> cd C:\RubyDevKit
PS C:\RubyDevKit> ruby dk.rb init

Initialization complete! Please review and modify the auto-generated
'config.yml' file to ensure it contains the root directories to all
of the installed Rubies you want enhanced by the DevKit.
```

Na pasta **c:\RubyDevKit**, abra o arquivo **config.yml** e adicione a linha abaixo no final do arquivo.

```
 - C:/Ruby22-x64
```

Depois execute no powershell o comando abaixo.

```
PS C:\RubyDevKit> ruby dk.rb install
[INFO] Updating convenience notice gem override for 'C:/Ruby22-x64'
[INFO] Installing 'C:/Ruby22-x64/lib/ruby/site_ruby/devkit.rb'
```

Para verificar se o ruby está rodando corretamente, execute no powershell os comandos abaixo.

```
PS C:\> gem install json --platform=ruby
Temporarily enhancing PATH to include DevKit...
Building native extensions.  This could take a while...
Successfully installed json-1.8.3
Parsing documentation for json-1.8.3
Installing ri documentation for json-1.8.3
Done installing documentation for json after 1 seconds
1 gem installed
PS C:\> ruby -rubygems -e "require 'json'; puts JSON.load('[42]').inspect"
[42]
```

**Instalar Bundler**

Para instalar o Bundler, execute no powershell o comando abaixo.

```
PS C:\> gem install bundler
Fetching: bundler-1.10.6.gem (100%)
Successfully installed bundler-1.10.6
Parsing documentation for bundler-1.10.6
Installing ri documentation for bundler-1.10.6
Done installing documentation for bundler after 4 seconds
1 gem installed
```

**Instalar o github-pages**

Para instalar a gem do github-pages, primeiro você precisa criar na raiz do projeto um arquivo chamado **Gemfile**.
Depois de criar o arquivo, adicione as linhas abaixo.

```
source 'https://rubygems.org'

gem 'github-pages'
```

Após adicionar as linhas acima no arquivo, vá ao powershell e execute o comando abaixo na raiz do projeto.

```
PS C:\projetos\jroliveira.github.io> bundle install
Fetching gem metadata from https://rubygems.org/............
Fetching version metadata from https://rubygems.org/...
Fetching dependency metadata from https://rubygems.org/..
Resolving dependencies...
Installing RedCloth 4.2.9 with native extensions
Installing i18n 0.7.0
Using json 1.8.3
Installing minitest 5.8.1
Installing thread_safe 0.3.5
Installing tzinfo 1.2.2
Installing activesupport 4.2.4
Installing addressable 2.3.8
Installing blankslate 2.1.2.4
Installing fast-stemmer 1.0.2 with native extensions
Installing classifier-reborn 2.0.3
Installing coffee-script-source 1.9.1.1
Installing execjs 2.6.0
Installing coffee-script 2.4.1
Installing colorator 0.1
Installing ffi 1.9.10
Installing ethon 0.8.0
Installing gemoji 2.1.0
Installing net-dns 0.8.0
Installing public_suffix 1.5.1
Installing typhoeus 0.8.0
Installing github-pages-health-check 0.5.3
Installing jekyll-coffeescript 1.0.1
Installing jekyll-gist 1.3.4
Installing jekyll-paginate 1.1.0
Installing sass 3.4.18
Installing jekyll-sass-converter 1.3.0
Installing rb-fsevent 0.9.6
Installing rb-inotify 0.9.5
Installing listen 3.0.3
Installing jekyll-watch 1.3.0
Installing kramdown 1.5.0
Installing liquid 2.6.2
Installing mercenary 0.3.5
Installing posix-spawn 0.3.11 with native extensions
Installing yajl-ruby 1.2.1 with native extensions
Installing pygments.rb 0.6.3
Installing redcarpet 3.3.2 with native extensions
Installing safe_yaml 1.0.4
Installing parslet 1.5.0
Installing toml 0.1.2
Installing jekyll 2.4.0
Installing jekyll-feed 0.3.1
Installing mini_portile 0.6.2
Installing nokogiri 1.6.6.2
Installing html-pipeline 1.9.0
Installing jekyll-mentions 0.2.1
Installing jekyll-redirect-from 0.8.0
Installing jekyll-sitemap 0.8.1
Installing jemoji 0.5.0
Installing maruku 0.7.0
Installing rdiscount 2.1.7 with native extensions
Installing terminal-table 1.5.2
Installing github-pages 39
Using bundler 1.10.6
Bundle complete! 1 Gemfile dependency, 55 gems now installed.
Use `bundle show [gemname]` to see where a bundled gem is installed.
Post-install message from nokogiri:
Nokogiri is built with the packaged libraries: libxml2-2.9.2, libxslt-1.1.28, zl
ib-1.2.8, libiconv-1.14.
Post-install message from html-pipeline:
-------------------------------------------------
Thank you for installing html-pipeline!
You must bundle Filter gem dependencies.
See html-pipeline README.md for more details.
https://github.com/jch/html-pipeline#dependencies
-------------------------------------------------
```

**Instalar o Python**

A versão que estou utilizando neste artigo é a [python-2.7.10.amd64][python].
Após baixar o arquivo, instale no caminho **C:\Python27** e selecione a opção **Add python.exe to PATH**.
Para verificar se o Python foi instalado corretamente, feche e abre o powershell e execute o comando abaixo.

```
PS C:\> python --version
Python 2.7.10
```

**Instalar o Easy Install**

Baixe o arquivo [ez_setup.py][ez] no **C:**, depois rode o comando abaixo no powershell.

```
PS C:\> python "C:\ez_setup.py"

Installed c:\python27\lib\site-packages\setuptools-18.3.2-py2.7.egg
Processing dependencies for setuptools==18.3.2
Finished processing dependencies for setuptools==18.3.2
```

Para verificar se o Easy Install foi instalado corretamente, execute o comando abaixo no powershell.

```
PS C:\> easy_install --version
setuptools 18.3.2 from c:\python27\lib\site-packages\setuptools-18.3.2-py2.7.egg (Python 2.7)
```

**Instalar o Pygments**

Para instalar, execute o comando abaixo no powershell.

```
PS C:\> easy_install Pygments
Searching for Pygments
Reading https://pypi.python.org/simple/Pygments/
Best match: Pygments 2.0.2
Downloading https://pypi.python.org/packages/source/P/Pygments/Pygments-2.0.2.ta
r.gz#md5=238587a1370d62405edabd0794b3ec4a
Processing Pygments-2.0.2.tar.gz
Writing c:\users\cliente\appdata\local\temp\easy_install-bzfr0n\Pygments-2.0.2\s
etup.cfg
Running Pygments-2.0.2\setup.py -q bdist_egg --dist-dir c:\users\cliente\appdata
\local\temp\easy_install-bzfr0n\Pygments-2.0.2\egg-dist-tmp-anbmeh
creating c:\python27\lib\site-packages\pygments-2.0.2-py2.7.egg
Extracting pygments-2.0.2-py2.7.egg to c:\python27\lib\site-packages
Adding pygments 2.0.2 to easy-install.pth file
Installing pygmentize-script.py script to C:\Python27\Scripts
Installing pygmentize.exe script to C:\Python27\Scripts

Installed c:\python27\lib\site-packages\pygments-2.0.2-py2.7.egg
Processing dependencies for Pygments
Finished processing dependencies for Pygments
```

Obrigado pela visita, e até a próxima.

[ruby]: http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.2.3-x64.exe
[devkit]: http://dl.bintray.com/oneclick/rubyinstaller/DevKit-mingw64-64-4.7.2-20130224-1432-sfx.exe
[python]: https://www.python.org/ftp/python/2.7.10/python-2.7.10.amd64.msi
[ez]: https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py