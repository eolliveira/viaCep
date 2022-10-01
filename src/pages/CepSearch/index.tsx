import './styles.css';

import ResultCard from 'components/ResultCard';
import React, { useState } from 'react';
import axios from 'axios';

const CepSearch = () => {
  const [formData, setFormData] = useState<FormData>({ cep: '' });
  const [address, setAddress] = useState<Address>();

  //tipo  da resposta da API
  type Address = {
    cep: string;
    localidade: string;
    uf: string;
    ddd: string;
  };

  //Representa os dados do formulário
  type FormData = {
    cep: string;
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //guarda qual o input que disparou o evento
    const name = event.target.name;

    //guarda o valor do input que disparou o evento
    const value = event.target.value;

    //atribui o valor capturado(value), para o input que disparou o evento com SpradOperator
    setFormData({ ...formData, [name]: value });
  };

  //copiar tipo do retorno do evento, posicionando o cursor sobre a chamada da função
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    var msg = document.getElementById('msg-cep-invalido');

    axios
      .get(`https://viacep.com.br/ws/${formData.cep}/json/`)
      .then((response) => {
        setAddress(response.data);

        msg?.classList.add('cep-valido');
        msg?.classList.remove('cep-invalido');
      })
      .catch((error) => {
        setAddress(undefined);

        console.log(error);
        
        msg?.classList.add('cep-invalido');
        msg?.classList.remove('cep-valido');
      });
  };

  return (
    <div className="cep-search-container">
      <h1 className="text-primary">Busca CEP</h1>
      <div className="container search-container">
        <form onSubmit={handleSubmit}>
          <div id="formulario" className="form-container">
            <p id="msg-cep-invalido" className="msg-cep">
              CEP Inválido!
            </p>
            <input
              type="number"
              /*name deve "casar" com om tipo do formulário*/
              name="cep"
              value={formData.cep}
              className="search-input"
              placeholder="CEP (somente números)"
              onChange={handleFormChange}
            />
            <button type="submit" className="btn btn-primary search-button">
              Buscar
            </button>
          </div>
        </form>

        {/* dverifica se o endereço é undefined */}
        {address && (
          <>
            <ResultCard title="CEP" description={address?.cep} />
            <ResultCard
              title="Localidade"
              description={`${address?.localidade} - ${address.uf}`}
            />
            <ResultCard title="DDD" description={address?.ddd} />
          </>
        )}
      </div>
    </div>
  );
};

export default CepSearch;
