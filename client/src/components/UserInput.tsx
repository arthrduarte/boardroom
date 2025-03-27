import React from "react";
import { useState } from "react"; // Importa o hook useState para gerenciar o estado do input

const UserInput = () => {
  // useState cria uma variável de estado "inputValue" e uma função "setInputValue" para alterá-la
  const [inputValue, setInputValue] = useState("");

  // Função chamada quando o formulário é enviado
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    console.log("Texto digitado:", inputValue); // Exibe no console o que foi digitado
    setInputValue(""); // Limpa o campo de input após o envio
  };

  // Função para ativar o reconhecimento de voz
  const handleVoiceInput = () => {
    // Verifica se o navegador suporta reconhecimento de voz
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) { // Se não for suportado, exibe uma mensagem no console e sai da função
      console.log("❌ Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition(); // Cria uma nova instância do reconhecimento de voz
    recognition.lang = "pt-BR"; // Define o idioma para português do Brasil
    recognition.start(); // Inicia a captura de áudio

    // Exibe uma mensagem no console informando que a gravação começou
    recognition.onstart = () => console.log("🎤 Gravando...");

    interface SpeechRecognitionEvent extends Event {
      results: SpeechRecognitionResultList;
    }

    // Quando o reconhecimento de voz obtém um resultado
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript; // Extrai o texto reconhecido
      console.log("🗣️ Você disse:", transcript); // Exibe no console o que foi falado
      setInputValue(transcript); // Atualiza o input com o texto falado
    };

    // Se houver um erro durante o reconhecimento, exibe no console
    recognition.onerror = (event: any) => {
      console.log("⚠️ Erro:", event.error);
    };

    recognition.onend = () => {
      console.log("🔴 Parou de gravar.");
    };
  };

  return (
    <div className="bg-white">
      <h1>Meu Formulário</h1>

      {/* Formulário com input e botão de envio */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue} // Define o valor do input como o estado "inputValue"
          onChange={(e) => setInputValue(e.target.value)} // Atualiza o estado ao digitar no input
          placeholder="Digite ou fale algo..." // Texto de ajuda dentro do input
        />
        <button type="submit">Enviar</button> {/* Botão para enviar o formulário */}
      </form>

      {/* Botão que ativa o reconhecimento de voz */}
      <button onClick={handleVoiceInput}>🎤 Gravar</button>
    </div>
  );
};

export default UserInput; // Exporta o componente Main para ser usado em outros arquivos
