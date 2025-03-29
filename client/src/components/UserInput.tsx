import React from "react";
import { useState } from "react"; // Importa o hook useState para gerenciar o estado do input

interface UserInputProps {
  userId: string;
}

const UserInput = ({ userId }: UserInputProps) => {
  // useState cria uma variável de estado "inputValue" e uma função "setInputValue" para alterá-la
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Função chamada quando o formulário é enviado
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_input: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send input to server');
      }

      setInputValue(""); // Limpa o campo de input após o envio
    } catch (error) {
      console.error('Error sending input:', error);
      alert('Failed to process your input. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Share Your Thoughts</h1>

      {/* Formulário com input e botão de envio */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What's on your mind? Share your thoughts or concerns..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={`flex-1 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors
              ${(isLoading || !inputValue.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>

          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={isLoading}
            className={`flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            🎤 Voice Input
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInput; // Exporta o componente Main para ser usado em outros arquivos
