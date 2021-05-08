---
layout: post/index
title: "Consumindo DataSnap Server com C#"
date: 2011-04-01
comments: true
categories: 
- dev
tags: 
- csharp
- delphi
- datasnap
- json
lang: pt
---

Ol&#225; pessoal, mais um post sobre **DataSnap** com **Delphi XE**, agora eu vou demonstrar como consumir um m&#233;todo em um servidor DataSnap a partir de um cliente em **C#**.

<!--more-->

Segue o c&#243;digo do nosso m&#233;todo respons&#225;vel por fazer a requisi&#231;&#227;o no servidor.

{% codeblock lang:csharp line_number:true highlight:true %}
private static string HttpGet(string url)
{
    string result;

    try
    {
        //Faz a requisicao a url montada acima.
        using (var resp = WebRequest.Create(url).GetResponse())
        {
            var reader = new StreamReader(resp.GetResponseStream());
            result = reader.ReadToEnd();
        }
    }
    catch
    {
        throw new Exception("Ocorreu um erro!");
    }

    return result;
}
{% endcodeblock %}

M&#233;todo respons&#225;vel por fazer a valida&#231;&#227;o dos dados antes de realizar a solicita&#231;&#227;o no servidor.

{% codeblock lang:csharp line_number:true highlight:true %}
private bool Validacao()
{
    if (TxtCPF.Text.Trim() == string.Empty)
    {
        MessageBox.Show("Digite um CPF!");
        TxtCPF.Focus();
        return false;
    }

    return true;
}
{% endcodeblock %}

M&#233;todo principal da aplica&#231;&#227;o. Note que estou utilizando uma classe chamada **JObject** para fazer a convers&#227;o dos dados de retorno do servidor para um objeto em JSON, est&#225; classe est&#225; contida na Class Library **Newtonsoft.Json.dll** para trabalhar com dados em JSON. Segue o link do projeto para download <a href="http://james.newtonking.com/projects/json-net.aspx" target="_blank" rel="external noopener">Json.NET</a>. Estou utilizando est&#225; classe pois achei bem simples a forma de utiliza&#231;&#227;o.

{% codeblock lang:csharp line_number:true highlight:true %}
private void BtnValidar_Click(object sender, EventArgs e)
{
    //Verifica se o campo CPF foi digitado.
    if (!Validacao()) return;

    //Caminho do servidor de aplicacao.
    const string servidor = @"http://localhost:8081/datasnap/rest/";

    //Metodo que sera consumido.
    const string metodo = @"TServerFunctions/validateCPF/";

    //Parametros do metodo.
    var parametro = TxtCPF.Text.Trim();

    //URL que sera processada.
    var url = string.Format("{0}{1}{2}", servidor, metodo, parametro);

    string pagina;
    try
    {
        //Faz a requisicao a url montada acima.
        pagina = HttpGet(url);
    }
    catch (Exception ex)
    {
        MessageBox.Show(ex.Message);

        return;
    }

    //Verifica se o metodo retornou algum valor.
    if (pagina == null) return;

    //Le os dados de retorno do servidor passando para JSON.
    var obj = JObject.Parse(pagina);

    //Verifica o retorno do metodo. 
    //E mostra para o usuario.
    var array = (JArray)obj["result"];
    if ((bool)array[0])
        MessageBox.Show(@"CPF valido!");
    else
        MessageBox.Show(@"CPF invalido!");
}
{% endcodeblock %}

Este foi mais um post de integra&#231;&#227;o usando **DataSnap** espero que tenham gostado.
