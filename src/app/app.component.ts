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

  constructor(private formBuilder: FormBuilder) {
    this.formDados = this.formBuilder.group({
      addWord: ['', Validators.required],
      verifyWord: ['', Validators.required]
    });
  }

  criarNovoEstado() {
    let estado = {
      'a': '','b': '','c': '','d': '','e': '','f': '',
      'g': '','h': '','i': '','j': '','k': '','l': '',
      'm': '','n': '','o': '','p': '','q': '','r': '',
      's': '','t': '','u': '','v': '','w': '','x': '',
      'y': '','z': ''}
    return estado;
  }

  adicionarPalavra() {
    var palavra = this.formDados.get('addWord').value;
    if (palavra!="") {
      this.palavras.push(palavra);
      this.formDados.reset();
      this.gerarAutomato(palavra);
    }
  }

  estadoJaExiste(index) {
    return ((index).toString() > (this.dicionario.length-1))
  }

  gerarAutomato(palavra) {
    if (!this.dicionario.length) {
      var palavra = palavra.split('');
      palavra.forEach((letra, index) => {
        let estado = this.criarNovoEstado();
        estado[letra] = 'q' + (index+1).toString();
        this.dicionario.push(estado);
      });
    } else {
      //Verificar os estado existente e alterar 
      //senao, adicionar um novo estado
      var palavra = palavra.split('');
      palavra.forEach((letra, index) => {
        if (this.estadoJaExiste(index)) {
          let estado = this.criarNovoEstado();
          estado[letra] = 'q' + (index+1).toString();
          this.dicionario.push(estado);
        } else {
          this.dicionario[index][letra] = 'q' + (index+1).toString();
        }
      });
    }
  }

  onKeydown(event) {
    if (event.key === "Backspace") {
      this.auxPalavra.pop();
    } else {
      this.auxPalavra.push(event.key);
      var proximo = this.proximoEstado(this.auxPalavra.length-1, event.key);
      if (!proximo) alert('Palavra não existente!')
    }
  }

  proximoEstado(estadoAtual, letra) {
    var novoEstado = this.dicionario[estadoAtual][letra];
    console.log('setColor -> row: ' + estadoAtual + ' - col: ' + (this.headerTable.findIndex((item) => {return (item.replace(' ', '')==letra.toUpperCase())})));
    return novoEstado;
  }

}
