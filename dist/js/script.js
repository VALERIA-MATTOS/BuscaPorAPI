var endereco= {
  colecoes:'https://oc-index.library.ubc.ca/collections',
  itens:'https://oc-index.library.ubc.ca/collections/darwin/items'
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
    pesquisarColecao();
  });
  
  acervo();
})

function pesquisarColecao(){
  var codigo=$('#campoPesquisa').val();
  $.getJSON(endereco.colecoes + '/' + codigo + '/items', function(data){
    console.log(data);
    var result='';
    for (var x=0; x< 10; x++){
      result+= data.data[x]._id + '<br>';
    }
    $('#busquei').html(result);
  })
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