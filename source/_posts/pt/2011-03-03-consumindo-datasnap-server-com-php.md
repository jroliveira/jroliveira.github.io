---
layout: post/index
title: "Consumindo DataSnap Server com PHP"
date: 2011-03-03
comments: true
categories: 
- dev
tags: 
- delphi
- datasnap
- jquery
- json
- php
lang: pt
---

Olá pessoal, estava estudando **DataSnap** com **Delphi XE**, e agora resolvi postar para vocês o resultado deste estudo. O primeiro post será sobre consumir um método em um servidor DataSnap a partir de um cliente em **PHP**.

<!--more-->

Segue o código da nossa página principal "**index.htm**". O código é bem simples apenas para mostrar a integração do **PHP** com o **DataSnap Server**, a única observação é que estou utilizando o framework **jQuery** para JavaScript apenas para deixar o exemplo mais interessante. Segue o link para download <a href="http://jqueryui.com/download" target="_blank" rel="external noopener">jqueryui.com</a>.

{% codeblock index.htm lang:html line_number:true highlight:true %}
<html>
<head>
    <title>ClientPHP</title>

    <!--jQuery-->
    <link rel="stylesheet" type="text/css" href="includes/css/ui-lightness/jquery-ui-1.8.9.custom.css">
    <script type="text/javascript" src="includes/js/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" src="includes/js/jquery-ui-1.8.9.custom.min.js"></script>

    <!--Aplicacao-->
    <link rel="stylesheet" type="text/css" href="includes/css/style.css">
    <script type="text/javascript" src="includes/js/script.js"></script>

</head>
<body>
	<form id="form_index" name="form_index" action="" onSubmit="return false">
        <label for="txtCPF" class="label">CPF: </label>
        <br />
        <input id="txtCPF" name="txtCPF" type="text" value="" class="text ui-widget-content ui-corner-all"/>
        <button id="btnValidar">Validar</button>
        <img id="loading" src="includes/images/loading.gif" width="16" height="16">
    </form>
</body>
</html>
{% endcodeblock %}

Abaixo o código do arquivo "**style.css**".

{% codeblock style.css lang:css line_number:true highlight:true %}
body {
	font: 62.5% "Trebuchet MS" , sans-serif;
	margin: 50px;
}

.text {
	padding: .3em;
}

.label {
	font: 14px "Verdana", sans-serif;
}
{% endcodeblock %}

Agora o codigo do arquivo "**script.js**".

{% codeblock script.js lang:js line_number:true highlight:true %}
$(document).ready(function() {
	//Personaliza os botoes da tela.
	$("button").button();

	//Esconde a imagem de loading.
	$("#loading").hide();

	//Evento do botao Validar.
	$("#btnValidar").click(function() {

		//Verifica se foi digitado um CPF.
		if ($.trim($("#txtCPF").val()) == "") {
			//Monstra a mensagem para o usuario.
			showMessage("Digite um CPF!");

			return false;
		}		

		//Mostra a imagem de loading.
		$("#loading").show();

		//Realiza uma requisicao sem atualizar a pagina.
		$.ajax ({
			//Tipo da requisicao.
			type : "post",
			//Caminho da Pagina que ira processar a requisicao.
			url : "index.source.php",
			//Serializa os campo do formulario e passa
			//como parametro para a pagina processar.
			data : $("#form_index").serialize(),
			//Caso nao aconteca nenhum erro, apresenta a mensagem
			//de retorno da pagina.
			success : function(msg) {
				showMessage(msg);
				//Esconde a imagem de loading.
				$("#loading").hide();
			},
			error : function() {
				showMessage("Ocorreu um erro!");
				//Esconde a imagem de loading.
				$("#loading").hide();
			}
		});		
	});
})

function showMessage(message) {
	//Cria uma div em tempo de execucao no body para mostrar
	//a mensagem ao usuario.
	$("body").append("<div id='message'>" + message + "</div>");

	//Configura e mostra a div criada acima.
	$("#message").dialog({
		bgiframe : true,
		modal : true,
		minimizable : false,
		resizable : false,
		closeOnEscape : true,
		title : "Mensagem",
		width : "300px",
		buttons : {
			Ok : function() {
				//Quando clicar em OK remove a div do html.
				$("#message").remove();
			}
		},
		close : function() {
			//Caso feche a div sem clicar em OK remove a div
			//do html tambem.
			$("#message").remove();
		}
	});
}
{% endcodeblock %}

E por fim o código da nossa página "**index.source.php**" que irá processar os dados.

{% codeblock index.source.php lang:php line_number:true highlight:true %}
<?php

	//Abilita apenas para aparecer os erros da aplicacao.
	error_reporting(E_ERROR);

	//Chama a funcao btnValidar()
	btnValidar();

	function btnValidar()
	{
		//Caminho do servidor de aplicacao.
		define("servidor", "http://localhost:8081/datasnap/rest/");

		//Metodo que sera consumido.
		define("metodo", "TServerFunctions/validateCPF/");

		//Parametros do metodo.
		$parametro = $_REQUEST["txtCPF"];

		//URL que sera processada.
		$url = sprintf("%s%s%s", servidor, metodo, $parametro);

		$pagina;
		try
		{
			//Faz a requisicao a url montada acima.
			$pagina = httpGet($url);
		}
		catch (Exception $e)
		{
			//Sai do metodo e apresenta a mensagem de erro
			//para ser capturada pela funcao sucess do jQuery.
			die($e->getMessage());
		}

		//Le os dados de retorno do servidor passando para JSON.
		$obj = json_decode($pagina[0]);

		//Verifica o retorno do metodo.
		//E printa para ser capturada pela funcao sucess do jQuery.
		if ($obj->{"result"}[0])
			echo("CPF Valido!");
		else
			echo("CPF Invalido!");
	}

	function httpGet($url)
	{
		//Faz a requisicao a url montada acima.
		$result = file($url);
		if ($result == NULL)
			throw new Exception("Ocorreu um erro!");

		return $result;
	}

?>
{% endcodeblock %}

Abaixo uma imagem de como deverá ser criada a estrutura de pastas dos arquivos citados acima.

![auto][structure]

E agora uma imagem de como ficará o exemplo.

![auto][sample]

Bom pessoal espero que tenham gostado e que seja útil de alguma forma. A idéia deste post foi mesmo apenas demonstrar como é fácil consumir um método usando **PHP** em um servidor **DataSnap**.

[structure]: http://junioro.files.wordpress.com/2011/02/estrutura-arquivos-datasnap-server-php.png "auto"
[sample]: http://junioro.files.wordpress.com/2011/02/site-datasnap-server-php.png "auto"
