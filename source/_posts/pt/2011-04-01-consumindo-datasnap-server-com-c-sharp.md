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

Olá pessoal, mais um post sobre **DataSnap** com **Delphi XE**, agora eu vou demonstrar como consumir um método em um servidor DataSnap a partir de um cliente em **C#**.

<!--more-->

Segue o código do nosso método responsável por fazer a requisição no servidor.

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

Método responsável por fazer a validação dos dados antes de realizar a solicitação no servidor.

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

Método principal da aplicação. Note que estou utilizando uma classe chamada **JObject** para fazer a conversão dos dados de retorno do servidor para um objeto em JSON, está classe está contida na Class Library **Newtonsoft.Json.dll** para trabalhar com dados em JSON. Segue o link do projeto para download <a href="http://james.newtonking.com/projects/json-net.aspx" target="_blank" rel="external noopener">Json.NET</a>. Estou utilizando está classe pois achei bem simples a forma de utilização.

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

Este foi mais um post de integração usando **DataSnap** espero que tenham gostado.
