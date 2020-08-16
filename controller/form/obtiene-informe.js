var t = "";

t = $('#datatable-responsive-consulta').DataTable({
	"language": {
			"url": dt_language
	}
	,"dom": '<"top">rt<"bottom"p><"clear">'
});

var clave_form = $("#clave-form").validate({
    rules: {
        claveUnica: {
            required: true
        }
    }
});

var sustentante_form = $("#sustentante-form").validate({
    rules: {
        folio: {
            required: true
        },
        nombre: {
            required: true
        },
        apPaterno: {
            required: true
        }
    }
});


$("#metodo-clave").click(function(){
    $("#menu").slideUp();
    $("#form2").slideDown();
    return false;
});

$("#metodo-sustentante").click(function(){
    $("#menu").slideUp();
    $("#form3").slideDown();
    return false;
});

$("#envia-cv").click(function(){
    if($("#clave-form").valid()){
        var cv = $("#claveUnica").val();
        console.info(cv);
        var api_url   = pr_api + "form/reporteCVE.php?cve=" + cv;
        $.ajax({
                url: api_url,
        }).done(function(response) {
                if(response != null && response != "") {
                    var data = null;
                    try {
                        data = JSON.parse(response);
                    } catch(e) {
                    }

                    if (data == null) {
                        window.location.href = api_url;
                        $("#claveUnica").val("");
                    } else {
                        $("#errorMessage").text(data.Response);
                        $("#error-modal").modal("show");
                    }
                } else {
                    $("#errorMessage").text("Error de comunicación. Por favor, inténtelo más tarde.");
                    $("#error-modal").modal("show");
                }
        }).fail(function(){
            $("#errorMessage").text("Error de comunicación. Por favor, inténtelo más tarde.");
            $("#error-modal").modal("show");
        });
    }
  return false;
});


$("#envia-sustentante").click(function(){
  if($("#sustentante-form").valid()){
    var folio = $("#folio").val();
    var nombre = $("#nombre").val();
    var primerAp = $("#apPaterno").val();
    var api_url   = pr_api +"form/reporteSustentante.php?folio="+folio+"&primerAp="+primerAp+"&nombre="+nombre;
    $.ajax({
            method: "GET",
            async:false,
            dataType: 'json',
            url: api_url,
    }).done(function(data) {
            if(typeof data.Resultado !== 'undefined' && data.Resultado.length > 0){
                t.clear().draw();
                for(var i = 0; i<data.Resultado.length; i++){
                    muestraDetalle(data.Resultado[i]);
                }
                $("#sustentanteModal").modal('show');
                t.draw(false);
            } else {
                $("#errorMessage").text(data.Response);
                $("#error-modal").modal("show");
            }
    }).error(function(jqXHR, textStatus, errorThrown) {
        $("#errorMessage").text("Error de comunicación. Por favor, inténtelo más tarde.");
        $("#error-modal").modal("show");
    });
  }
  return false;
});

$("#cancela-sustentante").click(function(){
	$("#form3").slideUp();
	$("#menu").slideDown();
	$("#folio").val("");
	$("#nombre").val("");
	$("#apPaterno").val("");
	sustentante_form.resetForm();
  return false;
});


$("#cancela-cv").click(function(){
	$("#form2").slideUp();
	$("#menu").slideDown();
	$("#claveUnica").val("");
	clave_form.resetForm();
  return false;
});

$("#folio").on("keypress keyup blur",function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

$("#form2").keypress(function(event) {
    if(event.keyCode == 13) {
        $("#envia-cv").click();
    }
});

$("#form3").keypress(function(event) {
    if(event.keyCode == 13) {
        $("#envia-sustentante").click();
    }
});

$("#form2,#form3").submit(function(event) {
  event.preventDefault();
});

function muestraDetalle(obj){
  let nombre = obj.nombre+" "+obj.primerApellido;
  
  if (obj.segundoApellido) {
      nombre += " " + obj.segundoApellido;
  }
  
  t.row.add([
		 obj.folio,
     obj.fechaAplicacion,
		 nombre,
     "<a href='"+ pr_api +"form/reporteFolioNombre.php?folio="+obj.folio+"&nombre="+obj.nombre+"&primerApellido="+obj.primerApellido+"'><i class='fa fa-cloud-download'></i></a>"
  ]);
}
