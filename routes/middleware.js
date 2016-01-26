/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');
var keystone = require('keystone');


exports.theme = function (req, res, next) {
    if (req.query.theme) {
        req.session.theme = req.query.theme;
    }
    res.locals.themes = [
        'Bootstrap',
        'Cerulean',
        'Cosmo',
        'Cyborg',
        'Darkly',
        'Flatly',
        'Journal',
        'Lumen',
        'Paper',
        'Readable',
        'Sandstone',
        'Simplex',
        'Slate',
        'Spacelab',
        'Superhero',
        'United',
        'Yeti',
    ];
    res.locals.currentTheme = req.session.theme || 'Flatly';
    next();
};


/**
 Initialises the standard view locals
 
 The included layout depends on the navLinks array to generate
 the navigation in the header, you may wish to change this array
 or replace it with your own templates / logic.
 */

exports.initLocals = function (req, res, next) {

    var locals = res.locals;
    if (req.user) {
        if (req.user.isAdmin) {
            locals.navLinks = [
				{label: 'Painel de Controle', href: '/painel'},
                {label: 'Inicio', key: 'home', href: '/'},
                {label: 'Oportunidades', key: 'tecnologia', href: '/#op'},
                {label: 'Noticias', href: '/blog'},
                {label: 'agenda', href: '/agenda'},
                /*{label: 'Home', key: 'home', href: '/'},
                 {label: 'Noticias', key: 'blog', href: '/blog'},
                 {label: 'Galeria', key: 'gallery', href: '/gallery'},
                 {label: 'Contato', key: 'contact', href: '/contact'},
                 {label: 'Aprovaçao', key: 'aprovacao', href: '/aprovacao'},*/
            ];

            locals.user = req.user;

            next();
        } else if (req.user.responsavel) {

            locals.navLinks = [
				{label: 'Painel de Controle', href: '/painel'},
                {label: 'Inicio', key: 'home', href: '/'},
                {label: 'Oportunidades', key: 'tecnologia', href: '/#op'},
                {label: 'Noticias', href: '/blog'},
                {label: 'Agenda', href: '/agenda'},
            ];

            locals.user = req.user;

            next();
        }
    } else {
        locals.navLinks = [
            {label: 'Inicio', key: 'home', href: '/'},
            {label: 'Oportunidades', key: 'tecnologia', href: '/#op'},
            {label: 'Noticias', href: '/blog'},
            {label: 'agenda', href: '/agenda'},
            {label: 'Cadastro', key: 'cadastro', href: '/cadastro'},
        ];

        locals.user = req.user;

        next();
    }
};


/**
 Fetches and clears the flashMessages before a view is rendered
 */

exports.flashMessages = function (req, res, next) {

    var flashMessages = {
        info: req.flash('info'),
        success: req.flash('success'),
        warning: req.flash('warning'),
        error: req.flash('error')
    };

    res.locals.messages = _.any(flashMessages, function (msgs) {
        return msgs.length;
    }) ? flashMessages : false;

    next();

};


/**
 Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function (req, res, next) {

    if (!req.user) {
        req.flash('error', 'Voce nao tem acesso a esta pagina.');
        res.redirect('/q4qrsd5khd11bw');
    } else {
        next();
    }

};

exports.requireAdmin = function (req, res, next) {

    if (!req.user.isAdmin) {
        req.flash('error', 'Voce nao tem acesso a esta pagina.');
        res.redirect('/q4qrsd5khd11bw');
    } else {
        next();
    }

};



