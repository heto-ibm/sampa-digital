var keystone = require('keystone');
var Empresa = keystone.list('Empresa');
var Oportunidade = keystone.list('Oportunidade');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
	var url = view.req.originalUrl;
	locals.tipo = url.substr(url.indexOf("?") + 1);
    locals.section = 'cadastroOportunidade';
    locals.tipoOfertas = Oportunidade.fields.tipoOferta.ops;
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.compra = false;
    locals.venda = false;

    // Cadastro Empresa e Usuario
    view.on('post', {action: 'cadastroOportunidade'}, function (next) {

        var empresa = Empresa.model.findOne().where('usuario', locals.user.id);
        empresa.exec(function (err, resultE) {
            var oportunidade = new Oportunidade.model({
                isAtivo: true,
                empresa: resultE.id,
            });
            var updaterO = oportunidade.getUpdateHandler(req);
            updaterO.process(req.body, {
                flashErrors: true
            }, function (err) {
                if (err) {
                    locals.validationErrors = err.errors;
                } else {
                    console.log("Oportunidade: " + req.body.nome);
                    locals.oportunidadeSubmitted = true;
                    oportunidade.isAtivo = true;
                    oportunidade.save();
                }
                next();
            });
        });
    });

    //Cadastro de compra
	if(locals.tipo == "compra"){
        locals.compra = true;
	}
	else if (locals.tipo == "venda"){
		locals.venda = true;
	}


    view.render('cadastroOportunidade');
}