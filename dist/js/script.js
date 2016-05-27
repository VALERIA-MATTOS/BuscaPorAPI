var endereco='https://oc-index.library.ubc.ca/collections';

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
  acervo();
})

function acervo(){
  $.getJSON(endereco, function(data){
    console.log(data);
    var result='';
    var x=0;
    result+='<table border="2"><tr><th>Código</th><th>Título da coleção</th><th>Posicao</th>';
    for (var n=0; n<373; n++){
      x++;
      if (data.data[n]==undefined) {
        do {
          n++;
        } while(data.data[n]==undefined);
      }
      result+='<tr><td>' + data.data[n] + '</td>';
      result+='<td>' + n + '</td>'
      result+='<td>' + x + '</td></tr>'
    }
    '</table>';
    $('#tabelaAcervo').html(result);
  });
}
