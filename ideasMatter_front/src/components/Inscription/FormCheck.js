export default {
  checkNameSurname (context) {
    context = context.toUpperCase()
    const minLength = (context.indexOf(' ') !== -1) ? 5 : 4
    if (context.length < minLength) {
      return false
    }
    for (var i = 0; i < context.length; i++) {
      if (context.charAt(i) >= 'A' && context.charAt(i) <= 'Z') {
        continue
      } else if (context.charAt(i) === ' ') {
        continue
      } else {
        return false
      }
    }

    if (this.nbChar(context, ' ') > 1) {
      return false
    }

    var untilNow = 0
    for (i = 0; i < context.length; i++) {
      if (context.charAt(i) !== ' ' && i !== context.length - 1) {
        untilNow = untilNow + 1
      } else if (i === context.length - 1 && untilNow < 2) {
        return false
      } else if (untilNow < 3 && context.charAt(i) === ' ') {
        return false
      } else {
        untilNow = 0
      }
    }
    return true
  },
  nbChar (chaine, lettre) {
    var cpt = 0
    for (var i = 0; i < chaine.length; i++) {
      if (chaine.charAt(i) === lettre) {
        cpt = cpt + 1
      }
    }
    return cpt
  },
  checkMdp (mdp) {
    if (mdp.length < 6) {
      return false
    }
    var cpt = 0
    for (var i = 0; i < mdp.length; i++) {
      if (mdp.charAt(i) >= '0' && mdp.charAt(i) <= '9') {
        cpt = cpt + 1
      }
    }
    if (cpt === 0) {
      return false
    }
    cpt = 0
    for (i = 0; i < mdp.length; i++) {
      if (mdp.charAt(i) >= 'A' && mdp.charAt(i) <= 'Z') {
        cpt = cpt + 1
      }
    }
    if (cpt === 0) {
      return false
    }
    return true
  },
  checkAdresse (adresse) {

  },
  checkMdpMatch (mdp1, mdp2) {
    return mdp1 === mdp2
  },
  checkMail (mail) {
    var expressionReguliere = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/
    return expressionReguliere.test(mail)
  }
}
