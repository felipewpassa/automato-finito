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
      'a': {'estado': '', 'cor': '', 'isFinal': false},
      'b': {'estado': '', 'cor': '', 'isFinal': false},
      'c': {'estado': '', 'cor': '', 'isFinal': false},
      'd': {'estado': '', 'cor': '', 'isFinal': false},
      'e': {'estado': '', 'cor': '', 'isFinal': false},
      'f': {'estado': '', 'cor': '', 'isFinal': false},
      'g': {'estado': '', 'cor': '', 'isFinal': false},
      'h': {'estado': '', 'cor': '', 'isFinal': false},
      'i': {'estado': '', 'cor': '', 'isFinal': false},
      'j': {'estado': '', 'cor': '', 'isFinal': false},
      'k': {'estado': '', 'cor': '', 'isFinal': false},
      'l': {'estado': '', 'cor': '', 'isFinal': false},
      'm': {'estado': '', 'cor': '', 'isFinal': false},
      'n': {'estado': '', 'cor': '', 'isFinal': false},
      'o': {'estado': '', 'cor': '', 'isFinal': false},
      'p': {'estado': '', 'cor': '', 'isFinal': false},
      'q': {'estado': '', 'cor': '', 'isFinal': false},
      'r': {'estado': '', 'cor': '', 'isFinal': false},
      's': {'estado': '', 'cor': '', 'isFinal': false},
      't': {'estado': '', 'cor': '', 'isFinal': false},
      'u': {'estado': '', 'cor': '', 'isFinal': false},
      'v': {'estado': '', 'cor': '', 'isFinal': false},
      'w': {'estado': '', 'cor': '', 'isFinal': false},
      'x': {'estado': '', 'cor': '', 'isFinal': false},
      'y': {'estado': '', 'cor': '', 'isFinal': false},
      'z': {'estado': '', 'cor': '', 'isFinal': false}, 
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

  addEstadoFinal(index, palavra) {
    //console.log(palavra)
    var letraQuePontaParaFinal = palavra[palavra.length-1]
    //console.log('&&&&Create final ' + index + ' - ' + letraQuePontaParaFinal)
    this.dicionario[index-1][letraQuePontaParaFinal].isFinal = true;
    let novoEstado = this.criarNovoEstado();
    novoEstado.isFinal=true;
    this.dicionario.push(novoEstado);
    for(var i='a'.charCodeAt(0); i<='z'.charCodeAt(0); i++) {
      this.dicionario[index][String.fromCharCode(i)].estado = '--';
    }
  }

  gerarAutomato(palavra) {
    var auxIndex = 0;
    var novo = true;
    var auxPalavra = palavra.split('');
    auxPalavra.forEach((letra, index) => {
      //console.log(letra + ' - ' + index)
      if (!this.dicionario.length) { // Dicionario vazio add primeiro item
        this.countQ+=1;
        let novoEstado = this.criarNovoEstado();
        novoEstado[letra].estado = 'q' + (this.countQ).toString();
        this.dicionario.push(novoEstado);
      } else {
        if (!this.dicionario[index] || this.countQ >= this.dicionario.length) { // se não tem o index no dicionario add um novo 
          this.countQ+=1;
          let novoEstado = this.criarNovoEstado();
          novoEstado[letra].estado = 'q' + (this.countQ).toString();
          this.dicionario.push(novoEstado);
        } else {
          if (!this.dicionario[index][letra].estado) { // se existe o estado para a letra
            this.countQ+=1;
            this.dicionario[index][letra].estado = 'q' + (this.countQ).toString();
          }
        }
      }

      /*if (this.estadoExiste(index)) {
        if (index == 0) {
          if (!this.dicionario[index][letra].estado) {
            this.countQ+=1;
            this.dicionario[index][letra].estado = 'a' + (this.countQ).toString();
          }
        } else {
          
          if (this.countQ > this.dicionario.length) {
            this.countQ+=1;
            let novoEstado = this.criarNovoEstado();
            novoEstado[letra].estado = 'b' + (this.countQ).toString();
            this.dicionario.push(novoEstado);
          } else {
            if (!this.dicionario[index][letra].estado) {
              this.countQ+=1;
              let novoEstado = this.criarNovoEstado();
              novoEstado[letra].estado = 'q' + (this.countQ).toString();
              this.dicionario.push(novoEstado);
            }
          }
        }
      } else {
        this.countQ+=1;
        let novoEstado = this.criarNovoEstado();
        novoEstado[letra].estado = 'r' + (this.countQ).toString();
        this.dicionario.push(novoEstado);
      }*/
    });
    this.addEstadoFinal(this.countQ, palavra);
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
    
    if (this.dicionario[atualQ]) {
      //console.log(this.dicionario[atualQ])

      var direcionarPara = this.dicionario[atualQ][letra].estado;
      //console.log('direct - ' + direcionarPara + ' - ' + this.isLetraFinal() +' - '+ letra)
      let estadoVerificado = this.criarEstadoVerificado();
      estadoVerificado.atual = 'q' + atualQ.toString();
      estadoVerificado.letra = letra;
      estadoVerificado.proximo = direcionarPara;
      this.automatoVerificado.push(estadoVerificado);
      if (direcionarPara=='--'){
        this.palavraCorreta = false;
      } else {
        if (direcionarPara) this.palavraCorreta = true;
        else this.palavraCorreta = false;
      }
    } else {
      this.palavraCorreta = false;
    }
  }

  reverseVerify(): void {
    var auxPalavra = "";
    this.automatoVerificado.forEach((estado, idx) => {
      auxPalavra+=estado.letra
      //console.log(auxPalavra + '-'+ this.formDados.get('verifyWord').value)
      if (auxPalavra == this.formDados.get('verifyWord').value) {
        this.palavraCorreta = true; 
      } else {
        this.palavraCorreta = false;
      }
    })
    console.log('Reverse: -> ' + this.palavraCorreta)
    //console.log(this.automatoVerificado)
    //var ultimoEstado = this.automatoVerificado[this.automatoVerificado.length-2]
    /*console.log(ultimoEstado)
    this.revemoStyle();*/
    //this.setColorTable(ultimoEstado.proximo, ultimoEstado.letra);
  }

  removeStyle() {
    var atual = this.automatoVerificado[this.automatoVerificado.length-1].atual
    var index = atual.substring(1, atual.length)-1
    var letraAnterior = this.automatoVerificado[this.automatoVerificado.length-2].letra
    
    this.dicionario.forEach((estado) => {
      this.headerTable.forEach((letra) => {
        var aux = letra.substring(0,1).toLowerCase()
        if(aux!='#') {
          estado[aux]['cor'] = ''
        }
      })
    })
  }

  verifyIntegridade() { // OK
    var isFinal = false;
    var proximoEstado = this.automatoVerificado[this.automatoVerificado.length-1].proximo //q6 para 'felipe'
    var idx = proximoEstado.substring(1, proximoEstado.length)
    //console.log('idx -> ' +  idx)
    //console.log(this.dicionario[idx])
    if (this.palavraCorreta) {
      if (this.dicionario[idx].isFinal) {
        isFinal = true;
      }
    }
    //console.log('Is Final: ' + isFinal);
    return isFinal
  }

  limparCampoVerify() {
    this.palavraCorreta = true;
    this.automatoVerificado = []
    this.formDados.reset();
  }

  isLetraFinal(): string {
    var estadoFinal = '';
    this.dicionario.forEach((estado) => {
      this.headerTable.forEach((letra) => {
        var aux = letra.substring(0,1).toLowerCase()
        if(aux!='#') {
          //console.log(aux)
          if (estado[aux].isFinal == true) estadoFinal = estado[aux].estado 
        }
      })
    })
    return estadoFinal;
  }

  onKeydown(event) {
    //code 8  - Backspace
    //code 13 - Enter
    //code 32 - Space
    var codeLetraDigitada = event.keyCode;
    var letraDigitada = '';
    //console.log('1 - ' + this.auxPalavra)
    if (codeLetraDigitada>=65 && codeLetraDigitada<=90) { //eh uma letra
      letraDigitada = event.key.toLowerCase();
      this.auxPalavra.push(event.key);

      if (!this.automatoVerificado.length) {// sem não tiver nada na lista de verificados
        this.verificarAutomato(0, event.key);
      } else {
        //if (this.isLetraFinal() == proximoEstado) this.reverseVerify();


        var proximoEstado = this.automatoVerificado[this.automatoVerificado.length-1].proximo
        var novoIndex = proximoEstado.substring(1, proximoEstado.length)

        if (novoIndex) {
          this.verificarAutomato(novoIndex, event.key)
        } else {

          //console.log("################")
          this.automatoVerificado.push(this.criarEstadoVerificado());
          //console.log('SEM index -> ' + novoIndex);
          //if (this.automatoVerificado[novoIndex].proximo == '-') {
            //console.log(' igual [--] -> ' + novoIndex);
            //this.inputColor = '#FF0000';
            //this.automatoVerificado.push(this.criarEstadoVerificado());
          //}
        }
      }
      //console.log('2 - ' + this.auxPalavra)

    } else if (codeLetraDigitada == 8) { // backspace
      //console.log('3 - ' + this.auxPalavra)
      if(this.formDados.get('verifyWord').value.length-1) {
        this.reverseVerify();
        this.auxPalavra.pop();
      } else {
        this.auxPalavra.length = 0;
        this.automatoVerificado = [];
      }
      this.automatoVerificado.pop();
      //console.log('4 - ' + this.auxPalavra)
    } else if (codeLetraDigitada == 13 || codeLetraDigitada == 32) {
      if (this.palavraCorreta) {
        this.removeStyle();
        this.limparCampoVerify();
        this.alert('Palavra válida', 'green');
      } else {
        this.removeStyle();
        this.limparCampoVerify();
        this.alert('Palavra inválida', 'red');
      }


    }
    /*if (event.key === "Backspace") {
      if(this.formDados.get('verifyWord').value.length-1) {
        this.reverseVerify();
        this.auxPalavra.pop();
      } else {
        this.auxPalavra.length = 0;
        this.automatoVerificado = [];
      }
      this.automatoVerificado.pop();
    /*} else if (event.key == " ") { 
      this.alert('Espaço não eh permitido!', 'red');
      this.limparCampoVerify();
    } else if (event.key === "Enter") { // OK
      /*if (this.verifyIntegridade()) {
        //this.revemoStyle();
        //this.limparCampoVerify();
        //this.alert('Palavra válida', 'green');
      } else {
        this.revemoStyle();
        this.limparCampoVerify();
        this.alert('Palavra inválida', 'red');
      }
    } else {
      this.auxPalavra.push(event.key);
      if (!this.automatoVerificado.length) {
        this.verificarAutomato(0, event.key);
      } else {
        var proximoEstado = this.automatoVerificado[this.automatoVerificado.length-1].proximo
        var novoIndex = proximoEstado.substring(1, proximoEstado.length)
        
        console.log('ProximoEstado -> ' + proximoEstado + 'Novo index -> ' + novoIndex);
        /*if (novoIndex) {
          this.verificarAutomato(novoIndex, event.key)
        } else { 
          //console.log('SEM index -> ' + novoIndex);
          if (this.automatoVerificado[novoIndex].proximo == '-') {
            this.inputColor = '#FF0000';
            this.automatoVerificado.push(this.criarEstadoVerificado());
          }
        }*/
      //}
    //} 
    if (this.palavraCorreta) {
      this.inputColor = '#0bb70b';
    } else {
      this.inputColor = '#FF0000';
    }
  }

  setColorTable(estadoAtual, letra) { 

    if (this.automatoVerificado.length) {
      var atual = this.automatoVerificado[this.automatoVerificado.length-1].atual
      var index = atual.substring(1, atual.length)
      var letraAnterior = this.automatoVerificado[this.automatoVerificado.length-1].letra
      console.log('atual' + atual)
      console.log('index' + index)
      console.log('letraAnterior' + letraAnterior)
      this.dicionario[index][letraAnterior].cor = '';
    }
    
    /*this.dicionario.forEach((estado) => {
      this.headerTable.forEach((letra) => {
        var aux = letra.substring(0,1).toLowerCase()
        if(aux!='#') {
          this.dicionario[estadoAtual][letra].cor = '';
        }
      })
    })*/

    
    this.dicionario[estadoAtual][letra].cor = 'item-selected';

  
    
    ///console.log('verificado -> ' + this.automatoVerificado);
    //console.log('atual -> ' + estadoAtual + ' - ' + letra);
    //this.dicionario[estadoAtual]['cor'] = "line-selected";
  }

}
