var endereco= {
  colecoes:'https://oc-index.library.ubc.ca/collections',
  itens:'https://oc-index.library.ubc.ca/collections/'
}

var cabecalho={
  colecao:'<table class="table table-striped table-bordered"><tr><th>Código</th><th>Título da coleção</th></tr>',
  item:'<br><table class="table table-striped table-bordered" id="tabelaInfos"><tr><th>Propriedades</th><th>Informações</th></tr>'
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
  escondeTabelas();
  $('#tabelaAcervo1').show();
})

function esconder(itens){
  for(var x=0; x<itens.length; x++){
    $(itens[x]).stop().hide();
  }
}

function escondeTabelas(){
  esconder(['#tabelaAcervo1','#tabelaAcervo2','#tabelaAcervo3','#tabelaAcervo4','#tabelaAcervo5','#tabelaAcervo6','#tabelaAcervo7','#tabelaAcervo8','#tabelaAcervo9','#tabelaAcervo10','#tabelaAcervo11','#tabelaAcervo12','#tabelaAcervo13','#tabelaAcervo14','#tabelaAcervo15']);
}

function limparResultadoPesquisa(){
  $('#tabelaInformacoes').html('');
}

function limparCampoPesquisa (){
  $('#campoPesquisa').val('');
  esconder(['#selecaoItem']);
  $("#myModal").modal();
}

function validacaoColecao (){
  var codigo=$('#campoPesquisa').val();
  if (codigo!=0) pesquisarColecao(codigo);
  else limparCampoPesquisa();
}

function acervo(){
  $.getJSON(endereco.colecoes, function(data){
    var result='';
    var tituloColecao='';
    var x=0;
    var c=0;
    result+=cabecalho.colecao;
    for (var n=0; n<373; n++){
      x++;
      if (data.data[n]==undefined) {
        do {
          n++;
        } while(data.data[n]==undefined);
      }
      result+='<tr><td>' + data.data[n] + '</td>';
      var acervoCodigo = data.data[n];
      tituloColecao=acervoTitulos(acervoCodigo);
      result+='<td>'+ tituloColecao +' </td></tr>';
      if (x===10){
        x=0;
        c++;
        result += '</table>';
        $('#tabelaAcervo'+ c).html(result);
        result=cabecalho.colecao;
      }
    }
  });
}

function acervoTitulos(acervoCodigo){
  var titulo = '';
  $.getJSON(endereco.colecoes + '/' + acervoCodigo, function(data){
      titulo=(data.data.title);
      return titulo;
  });
  console.log(titulo);
}

function pesquisarColecao(codigo){
  $.getJSON(endereco.itens + codigo + '/items', function(data){
    var result='<option value="#"> Escolha um item </option>';
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
      if ($(data.data.Creator).length != 0) result+='<tr><td> Criador </td><td>' + data.data.Creator[0].value + '</td></tr>';
      if ($(data.data.Contributor).length != 0) result+='<tr><td> Contribuidores </td><td>' + data.data.Contributor[0].value + '</td></tr>';
      if ($(data.data.Collection).length !=0) result+='<tr><td> Coleção </td><td>' + data.data.Collection[0].value + '</td></tr>';
      if ($(data.data.DateCreated).length !=0) result+='<tr><td> Data de criação </td><td>' + data.data.DateCreated[0].value + '</td></tr>';
      if ($(data.data.DateIssued).length !=0) result+='<tr><td> Data de emissão </td><td>' + data.data.DateIssued[0].value + '</td></tr>';
      if ($(data.data.Edition).length !=0) result+='<tr><td> Edição </td><td>' + data.data.Edition[0].value + '</td></tr>';
      if ($(data.data.Genre).length !=0) result+='<tr><td> Gênero </td><td>' + data.data.Genre[0].value + '</td></tr>';
      if ($(data.data.Language).length !=0) result+='<tr><td> Idioma </td><td>' + data.data.Language[0].value + '</td></tr>';
      if ($(data.data.Country).length !=0) result+='<tr><td> País </td><td>' + data.data.Country[0].value + '</td></tr>';
      if ($(data.data.Title).length !=0) result+='<tr><td> Título </td><td>' + data.data.Title[0].value + '</tr></table>';
      $('#tabelaInformacoes').html(result);
    })  
  }
  else limparResultadoPesquisa();
}

function paginacao (pagina){
  switch (pagina){
    case "1":
      escondeTabelas();
      $('#tabelaAcervo1').show();
      break;
    case "2":
      escondeTabelas();
      $('#tabelaAcervo2').show();
      break;
    case "3":
      escondeTabelas();
      $('#tabelaAcervo3').show();
      break;
    case "4":
      escondeTabelas();
      $('#tabelaAcervo4').show();
      break;
    case "5":
      escondeTabelas();
      $('#tabelaAcervo5').show();
      break;
    case "6":
      escondeTabelas();
      $('#tabelaAcervo6').show();
      break;
    case "7":
      escondeTabelas();
      $('#tabelaAcervo7').show();
      break;
    case "8":
      escondeTabelas();
      $('#tabelaAcervo8').show();
      break;
    case "9":
      escondeTabelas();
      $('#tabelaAcervo9').show();
      break;
    case "10":
      escondeTabelas();
      $('#tabelaAcervo10').show();
      break;
    case "11":
      escondeTabelas();
      $('#tabelaAcervo11').show();
      break;
    case "12":
      escondeTabelas();
      $('#tabelaAcervo12').show();
      break;
    case "13":
      escondeTabelas();
      $('#tabelaAcervo13').show();
      break;
    case "14":
      escondeTabelas();
      $('#tabelaAcervo14').show();
      break;
    case "15":
      escondeTabelas();
      $('#tabelaAcervo15').show();
      break;
  }
}