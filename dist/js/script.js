var endereco= {
  colecoes:'https://oc-index.library.ubc.ca/collections',
  itens:'https://oc-index.library.ubc.ca/collections/'
}

$(document).ready(function(){
  $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){
        window.location.hash = hash;
      });
    }
  });

  $(window).scroll(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;
      var winTop = $(window).scrollTop();
      if (pos < winTop + 600) {
        $(this).addClass("slide");
      }
    });
  });

  $('#pesquisar').click(function(){
    $('#tabelaItens').hide();
    validacaoColecao();
  });
  
  $('#selecaoItem').change(function(){
    tabelaItens();
  })
  acervo();
})

function validacaoColecao (){
  var codigo=$('#campoPesquisa').val();
  if (codigo!=0) pesquisarColecao(codigo);
  else limpar();
}

function pesquisarColecao(codigo){
  $.getJSON(endereco.itens + codigo + '/items', function(data){
    var result='<option value="#"> Escolha um item </option>';
    $('#selecaoItem').show();
    for (var x=0; x< 10; x++){
      result+='<option value=' + data.data[x]._id + '>' + data.data[x]._id + '</option>';
    }
    $('#selecaoItem').html(result);
  })
  .fail(function(){
    limpar();
  });
}

function tabelaItens (){
  var codigo=$('#campoPesquisa').val();
  var itemSelecionado = $('#selecaoItem').val();
  $.getJSON(endereco.itens + codigo + '/items/' + itemSelecionado, function(data){
    var result ='';
    result+='<br><table class="table table-striped table-bordered"><tr><th>Propriedades</th><th>Informações</th></tr>';
    result+='<tr><td> Coleção </td><td>' + data.data.Collection[0].value + '</td></tr>';
    result+='<tr><td> Gênero </td><td>' + data.data.Genre[0].value + '</td>';
    result+='<tr><td> Criador </td><td>' + data.data.Creator[0].value + '</td></tr>';
    result+='<tr><td> Título </td><td>' + data.data.Title[0].value + '</table>';
    $('#tabelaInformacoes').html(result);
  })
}

function limpar (){
  $('#campoPesquisa').val('');
  $('#selecaoItem').hide();
  $("#myModal").modal();
}

function acervo(){
  $.getJSON(endereco.colecoes, function(data){
    var result='';
    result+='<table class="table table-striped table-bordered"><tr><th>Código</th><th>Título da coleção</th></tr>';
    for (var n=0; n<373; n++){
      if (data.data[n]==undefined) {
        do {
          n++;
        } while(data.data[n]==undefined);
      }
      result+='<tr><td>' + data.data[n] + '</td>';
      result+='<td>'+ n +' </td></tr>'
    }
    '</table>';
    $('#tabelaAcervo').html(result);
  });
}