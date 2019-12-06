import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'app-automato';

  private auxPalavra = [];
  private formDados: FormGroup;
  private palavras = [];
  private dicionario = [];
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
          this.palavras.push(palavra);
          this.formDados.reset();
          this.gerarAutomato(palavra);
        } else {
          alert("A palavra não deve conter números!");
        }
      } else {
        alert("A palavra não deve conter espaços!");
      }
    } else {
      alert("A palavra não deve ser em branco!");
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

  /*estadoJaExiste(index) {
    return ((index).toString() > (this.dicionario.length-1))
  }*/

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
            console.log((this.dicionario.length) + ' letra -> ' + letra +  ' -> index' + index + ' ->' + this.countQ)
            this.dicionario[index][letra].estado = 'q' + (this.countQ).toString();
          } else {
            console.log("Tamanho -> " + this.dicionario.length)
            let novoEstado = this.criarNovoEstado();
            novoEstado[letra].estado = 'q' + (this.countQ).toString();
            this.dicionario.push(novoEstado);
          }
          //verifica se a letra tem um Q
          //sim -> ve para onde aponta e vai la
          //não -> adiciona Q
          /*if (this.QExiste(index, letra)) {
            //auxEstadoQ = this.QExiste(index, letra);
            console.log("Todo FUdido" + index)
          } else {
            
            console.log("NAO TEM PORRA NENHUMA")
          }*/
        } else {
          //dicionario length menor que a palavra
          let novoEstado = this.criarNovoEstado();
          novoEstado[letra].estado = 'q' + (this.countQ).toString();
          this.dicionario.push(novoEstado);
        }
      });
      //Adiciona um estado final apos a inserção de cada palavra
      this.addEstadoFinal(this.countQ);
      
    /*if (!this.dicionario.length) {
      var palavra = palavra.split('');
      palavra.forEach((letra, index) => {
        let estado = this.criarNovoEstado();
        estado[letra].estado = 'q' + (index+1).toString();
        this.dicionario.push(estado);
      });
    } else {
      //Verificar os estado existente e alterar 
      //senao, adicionar um novo estado
      var palavra = palavra.split('');
      palavra.forEach((letra, index) => {
        if (this.estadoJaExiste(index)) {
          let estado = this.criarNovoEstado();
          estado[letra].estado = 'q' + (index+1).toString();
          this.dicionario.push(estado);
        } else {
          this.dicionario[index][letra].estado = 'q' + (index+1).toString();
        }
      });
    }*/
  }

  onKeydown(event) {
    if (event.key === "Backspace") {
      this.auxPalavra.pop();
    } else if (event.key >= 'a' && event.key <= 'z'){
      this.auxPalavra.push(event.key);
      var proximo = this.proximoEstado(this.auxPalavra.length-1, event.key);
      if (!proximo) console.log('Palavra não existente!', !proximo)
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
        console.log('setColor -> row: ' + estadoAtual + ' - col: ' + (this.headerTable.findIndex((item) => {return (item.replace(' ', '')==letra.toUpperCase())})));
      }
      
    }
    return novoEstado;
  }

  teste() {
   
    //var line = 4;
    //this.testeClass = "{'font-size.px': 24}";//`tr:nth-child(${line}){background-color: red;}`;
  }

}
