var endereco= {
  colecoes:'https://oc-index.library.ubc.ca/collections',
  itens:'https://oc-index.library.ubc.ca/collections/'
}

var cabecalho={
  colecao:'<table class="table table-striped table-bordered"><tr><th>Collection code</th><th>Collection name</th></tr>',
  item:'<br><table class="table table-bordered" id="tabelaInfos"><tr><th>Properties</th><th>Information</th></tr>'
}

$(document).ready(function(){
  efeitoRolagemTela ();

  $('#limpar').click(function(){
    limparResultadoPesquisa();
    $('#selecaoItem').hide();
    $('#campoPesquisa').val('');
  })

  $('#pesquisar').click(function(){
    limparResultadoPesquisa();
    validacaoColecao();
  });
  
  $('#selecaoItem').change(function(){
    tabelaItens();
  })

  $('a').click(function(data){
    var pagina = $(this).attr('id');
    $("li").removeClass("active");
    $("li a[id="+pagina+"]").parent().addClass("active");
    paginacao (pagina);
  })

  acervo();
  $('.tabelasAcervo').hide();
  $('#tabelaAcervo1').show();
});

$(document).keypress(function(e) {
  if (e.which == 13) {
    e.preventDefault();
    limparResultadoPesquisa();
    validacaoColecao();
  }
});

function efeitoRolagemTela (){
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
}

function limparResultadoPesquisa(){
  $('#tabelaInformacoes').html('');
  $('#limpar').hide();
}

function limparCampoPesquisa (){
  $('#campoPesquisa').val('');
  $('#selecaoItem').hide();
  $("#myModal").modal();
}

function validacaoColecao (){
  var codigo=$('#campoPesquisa').val();
  if (codigo!=0) pesquisarColecao(codigo);
  else limparCampoPesquisa();
}

function acervo(){
  var acervoCodigo='';
  var itensPorPagina=0;
  var numeroPagina=0;
  var result='';
  var tituloColecao='';
  $.getJSON(endereco.colecoes, function(data){
    result+=cabecalho.colecao;
    for (var n=0; n<300; n++){
      itensPorPagina++;
      if (data.data[n]==undefined) {
        do {
          n++;
        } while(data.data[n]==undefined);
      }
      result+='<tr><td>' + data.data[n] + '</td>';
      acervoCodigo = data.data[n];
      tituloColecao=acervoTitulos(acervoCodigo);
      result+='<td>'+ tituloColecao +' </td></tr>';
      if (itensPorPagina===10){
        itensPorPagina=0;
        numeroPagina++;
        result += '</table>';
        $('#tabelaAcervo'+ numeroPagina).html(result);
        result=cabecalho.colecao;
      }
    }
  });
}

function acervoTitulos(acervoCodigo){
  var retorno = false;
  $.ajax({
      type: "GET",
      url: endereco.colecoes + '/' + acervoCodigo,
      dataType: "json",
      async: false,
      success: function(data) {
        retorno=data.data.title;
      }
  });
  return retorno;
}

function pesquisarColecao(codigo){
  $.getJSON(endereco.itens + codigo + '/items', function(data){
    var result='<option value="#"> Choose an item </option>';
    $('#selecaoItem').show();
    for (var x=0; x<data.data.length; x++){
      result+='<option value=' + data.data[x]._id + '>' + data.data[x]._id + '</option>';
    }
    $('#selecaoItem').html(result);
  })
  .fail(function(){
    limparCampoPesquisa();
  });
}

function tabelaItens (){
  var codigo=$('#campoPesquisa').val();
  var itemSelecionado = $('#selecaoItem').val();
  if (itemSelecionado!="#") {
    $.getJSON(endereco.itens + codigo + '/items/' + itemSelecionado, function(data){
      var result ='';
      result+=cabecalho.item;
      if ($(data.data.Creator).length != 0) result+='<tr><td> Creator </td><td>' + data.data.Creator[0].value + '</td></tr>';
      if ($(data.data.Contributor).length != 0) result+='<tr><td> Contributor </td><td>' + data.data.Contributor[0].value + '</td></tr>';
      if ($(data.data.Collection).length !=0) result+='<tr><td> Collection </td><td>' + data.data.Collection[0].value + '</td></tr>';
      if ($(data.data.DateCreated).length !=0) result+='<tr><td> Date created </td><td>' + data.data.DateCreated[0].value + '</td></tr>';
      if ($(data.data.DateIssued).length !=0) result+='<tr><td> Date Issued </td><td>' + data.data.DateIssued[0].value + '</td></tr>';
      if ($(data.data.Edition).length !=0) result+='<tr><td> Edition </td><td>' + data.data.Edition[0].value + '</td></tr>';
      if ($(data.data.Genre).length !=0) result+='<tr><td> Genre </td><td>' + data.data.Genre[0].value + '</td></tr>';
      if ($(data.data.Language).length !=0) result+='<tr><td> Language </td><td>' + data.data.Language[0].value + '</td></tr>';
      if ($(data.data.Country).length !=0) result+='<tr><td> Country </td><td>' + data.data.Country[0].value + '</td></tr>';
      if ($(data.data.Title).length !=0) result+='<tr><td> Title </td><td>' + data.data.Title[0].value + '</tr></table>';
      $('#tabelaInformacoes').html(result);
      $('#limpar').show();
    })  
  }
  else limparResultadoPesquisa();
}

function paginacao (pagina){
  $('.tabelasAcervo').hide();
  switch (pagina){
    case "1":
      $('#tabelaAcervo1').show();
      break;
    case "2":
      $('#tabelaAcervo2').show();
      break;
    case "3":
      $('#tabelaAcervo3').show();
      break;
    case "4":
      $('#tabelaAcervo4').show();
      break;
    case "5":
      $('#tabelaAcervo5').show();
      break;
    case "6":
      $('#tabelaAcervo6').show();
      break;
    case "7":
      $('#tabelaAcervo7').show();
      break;
    case "8":
      $('#tabelaAcervo8').show();
      break;
    case "9":
      $('#tabelaAcervo9').show();
      break;
    case "10":
      $('#tabelaAcervo10').show();
      break;
    case "11":
      $('#tabelaAcervo11').show();
      break;
    case "12":
      $('#tabelaAcervo12').show();
      break;
    case "13":
      $('#tabelaAcervo13').show();
      break;
    case "14":
      $('#tabelaAcervo14').show();
      break;
    case "15":
      $('#tabelaAcervo15').show();
      break;
  }
}