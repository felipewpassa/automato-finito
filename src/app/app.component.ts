import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'app-automato';

  private inputColor = "";
  private auxPalavra = [];
  private formDados: FormGroup;
  private palavras = [];
  private dicionario = [];
  private automatoVerificado = [];
  private headerTable = [
  '# ','A ','B ','C ','D ','E ','F ',
  'G ','H ','I ','J ','K ','L ','M ',
  'N ','O ','P ','Q ','R ','S ','T ',
  'U ','V ','W ','X ','Y ','Z '];
  private bodyTable = [];
  private testeClass = {"color": "red"};
  private auxColorEstadoAnterior;
  private auxColorLetraAnterior;
  private countQ = 0;
  private palavraCorreta = true;
  private exibirMsg = false;

  private exibirMsgCustom = false;
  private msgCustom = "";
  private msgClass = "";
 

  constructor(private formBuilder: FormBuilder) {
    this.formDados = this.formBuilder.group({
      addWord: ['', Validators.required],
      verifyWord: ['', Validators.required]
    });
  }

  criarNovoEstado() {
    // 'a': {'estado: 'q1', 'cor': ''}
    let estado = {
      'a': {'estado': '', 'cor': ''},
      'b': {'estado': '', 'cor': ''},
      'c': {'estado': '', 'cor': ''},
      'd': {'estado': '', 'cor': ''},
      'e': {'estado': '', 'cor': ''},
      'f': {'estado': '', 'cor': ''},
      'g': {'estado': '', 'cor': ''},
      'h': {'estado': '', 'cor': ''},
      'i': {'estado': '', 'cor': ''},
      'j': {'estado': '', 'cor': ''},
      'k': {'estado': '', 'cor': ''},
      'l': {'estado': '', 'cor': ''},
      'm': {'estado': '', 'cor': ''},
      'n': {'estado': '', 'cor': ''},
      'o': {'estado': '', 'cor': ''},
      'p': {'estado': '', 'cor': ''},
      'q': {'estado': '', 'cor': ''},
      'r': {'estado': '', 'cor': ''},
      's': {'estado': '', 'cor': ''},
      't': {'estado': '', 'cor': ''},
      'u': {'estado': '', 'cor': ''},
      'v': {'estado': '', 'cor': ''},
      'w': {'estado': '', 'cor': ''},
      'x': {'estado': '', 'cor': ''},
      'y': {'estado': '', 'cor': ''},
      'z': {'estado': '', 'cor': ''}, 
      'isFinal': false
    }
    return estado;
  }

  temEspacos(palavra): any {
    if (palavra.indexOf(" ")==-1) {
      return false;
    } else {
      return true;
    }
  }

  temNumeros(palavra): any {
    var regExp = /[0-9]/g;
    var result = palavra.match(regExp); 
    if (result) { //tem numero
      return true;
    } 
    return false;
  }
  
  validarPalavra(palavra) {
    if (palavra.length) {
      if (!this.temEspacos(palavra)) {
        if (!this.temNumeros(palavra)) {
          var jaPossui = false;
          this.palavras.forEach((palavraAramazenda) => {
            if (palavra == palavraAramazenda) jaPossui = true;
          })
          if (!jaPossui) {
            this.palavras.push(palavra);
            this.formDados.reset();
            this.gerarAutomato(palavra);
          } else {
            this.alert("A palavra já está cadastrada", 'red');
            this.limparCampoVerify();
          }
        } else {
          this.alert("A palavra não deve conter números!", 'red');
        }
      } else {
        this.alert("A palavra não deve conter espaços!", 'red');
      }
    } else {
      this.alert("A palavra não deve ser em branco!", 'red');
      return false;
    }
  }

  adicionarPalavra() {
    var palavra = this.formDados.get('addWord').value;
    palavra = palavra.toLowerCase()
    if (palavra) {
      this.validarPalavra(palavra);
    } else {
      alert('Palavra não pode ser em branco');
    }
  }

  estadoExiste(index) {
    return this.dicionario.length > index;
  }

  QExiste(index, letra) {
    return (this.dicionario[index][letra].estado)
  }

  addEstadoFinal(index) {
    let novoEstado = this.criarNovoEstado();
    novoEstado.isFinal=true;
    this.dicionario.push(novoEstado);
    for(var i='a'.charCodeAt(0); i<='z'.charCodeAt(0); i++) {
      this.dicionario[index][String.fromCharCode(i)].estado = '-';
    }
  }

  gerarAutomato(palavra) {
    var auxEstadoQ = '';
    var palavra = palavra.split('');
    palavra.forEach((letra, index) => {
      this.countQ+=1;
      if (this.estadoExiste(index)) {
        if (index == 0) {
          //console.log((this.dicionario.length) + ' letra -> ' + letra +  ' -> index' + index + ' ->' + this.countQ)
          this.dicionario[index][letra].estado = 'q' + (this.countQ).toString();
        } else {
          //console.log("Tamanho -> " + this.dicionario.length)
          let novoEstado = this.criarNovoEstado();
          novoEstado[letra].estado = 'q' + (this.countQ).toString();
          this.dicionario.push(novoEstado);
        }
      } else {
        //dicionario length menor que a palavra
        let novoEstado = this.criarNovoEstado();
        novoEstado[letra].estado = 'q' + (this.countQ).toString();
        this.dicionario.push(novoEstado);
      }
    });
    this.addEstadoFinal(this.countQ);
  }

  addWithEnter(event) {
    if (event.key === "Enter") {
      this.adicionarPalavra();
    }
  }

  criarEstadoVerificado() {
    let verificadorObj = {
      'atual': '',
      'letra': '',
      'proximo': ''
    }
    return verificadorObj;
  }

  alertBootStrap() {
    this.exibirMsg = true
    setTimeout(() => {  
      this.exibirMsg = false;
    },1000)
  }

  alert(msgCustom, msgColor) {
    this.msgCustom = msgCustom;
    
    if (msgColor=="green") { 
      this.msgClass = "alert alert-success";
    } else if (msgColor=="yellow") { 
      this.msgClass = "alert alert-warning";
    } else {
      this.msgClass = "alert alert-danger";
    }

    this.exibirMsgCustom = true
    setTimeout(() => {  
      this.exibirMsgCustom = false;
      this.msgCustom = '';
      this.msgClass = '';
    },1000)
  }

  verificarAutomato(atualQ, letra) {
    this.setColorTable(atualQ, letra);
    var direcionarPara = this.dicionario[atualQ][letra].estado;
    let estadoVerificado = this.criarEstadoVerificado();
    estadoVerificado.atual = 'q' + atualQ.toString();
    estadoVerificado.letra = letra;
    estadoVerificado.proximo = direcionarPara;
    this.automatoVerificado.push(estadoVerificado);
    if (direcionarPara) this.palavraCorreta = true;
    else this.palavraCorreta = false;
  }

  reverseVerify() {
    var auxPalavra = "";
    this.automatoVerificado.forEach((estado, idx) => {
      auxPalavra+=estado.letra
      if (auxPalavra == this.formDados.get('verifyWord').value) {
        this.palavraCorreta = true; 
        console.log('Reverse OK')
      }
      else this.palavraCorreta = false;
    })
    /*var ultimoEstado = this.automatoVerificado[this.automatoVerificado.length-2]
    console.log(ultimoEstado)
    this.revemoStyle();*/
    //this.setColorTable(ultimoEstado.proximo, ultimoEstado.letra);
  }

  revemoStyle() {
      var atual = this.automatoVerificado[this.automatoVerificado.length-1].atual
      var index = atual.substring(1, atual.length)-1
      var letraAnterior = this.automatoVerificado[this.automatoVerificado.length-2].letra
      
      this.dicionario.forEach((estado) => {
        this.headerTable.forEach((letra) => {
          var aux = letra.substring(0,1).toLowerCase()
          if(aux!='#') {
            console.log(aux)
            estado[aux]['cor'] = ''
          }
        })
      })
  
  }

  verifyIntegridade() { //returna true de estado eh final
    var isIntegro = true;
    var ultimaLetra = this.automatoVerificado[this.automatoVerificado.length-1].letra
    var proximoEstado = this.automatoVerificado[this.automatoVerificado.length-1].proximo
    var idx = proximoEstado.substring(1, proximoEstado.length)
    return this.dicionario[idx].isFinal;
  }

  limparCampoVerify() {
    this.palavraCorreta = true;
    this.automatoVerificado = []
    //this.formDados.controls['verifyWord'] = '';
    this.formDados.reset('');
  }

  onKeydown(event) { //verificar a palavra
    //this.revemoStyle();
    if (event.key === "Backspace") {
      if(this.formDados.get('verifyWord').value) {
        this.reverseVerify();
        //this.auxPalavra = []
      } else {
        this.auxPalavra.pop();
      }
      this.automatoVerificado.pop();
    } 
    if (event.key == " ") { 
      this.alert('Espaço não eh permitido!', 'red');
      this.limparCampoVerify();
    } else if (event.key === "Enter") { // OK
      if (this.verifyIntegridade()) {
        this.alert('Palavra válida', 'green');
      } else {
        this.alert('Palavra inválida', 'red');
      }
      this.revemoStyle();
      this.limparCampoVerify();
    } else {
      console.log("DIgitou algo")
      this.auxPalavra.push(event.key);
      if (!this.automatoVerificado.length) {
        this.verificarAutomato(0, event.key);
      } else {
        var proximoEstado = this.automatoVerificado[this.automatoVerificado.length-1].proximo
        var novoIndex = proximoEstado.substring(1, proximoEstado.length)
        //console.log('ProximoEstado -> ' + proximoEstado + 'Novo index -> ' + novoIndex);
        if (novoIndex) {
          this.verificarAutomato(novoIndex, event.key)
        } else { 
          //console.log('SEM index -> ' + novoIndex);
          if (this.automatoVerificado[novoIndex].proximo == '-') {
            this.inputColor = '#FF0000';
            this.automatoVerificado.push(this.criarEstadoVerificado());
          }
        }
      }
    } 
    //this.revemoStyle();
    if (this.palavraCorreta) {
      this.inputColor = '#0bb70b';
    } else {
      this.inputColor = '#FF0000';
    }
  }

  setColorTable(estadoAtual, letra) { 
    this.dicionario[estadoAtual][letra].cor = 'item-selected';
    this.auxColorEstadoAnterior = estadoAtual;
    this.auxColorLetraAnterior = letra;
    //this.dicionario[estadoAtual]['cor'] = "line-selected";
  }

  proximoEstado(estadoAtual, letra) {
    if (estadoAtual<this.dicionario.length) {
      var novoEstado = this.dicionario[estadoAtual][letra].estado;
      if (novoEstado) {
        this.setColorTable(estadoAtual, letra);
        //console.log('setColor -> row: ' + estadoAtual + ' - col: ' + (this.headerTable.findIndex((item) => {return (item.replace(' ', '')==letra.toUpperCase())})));
      }
    }
    return novoEstado;
  }
}
