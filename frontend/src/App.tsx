import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Loading from "./assets/loading.svg";
import FilipinoFlag from "./assets/flag.svg";
import './App.css';

function App() {
  const [userInput, setUserInput] = useState<string>('');
  const [predictedLabel, setPredictedLabel] = useState<string>('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const predictLabel = async () => {
    if (userInput === '') {
      setPredictedLabel('Please enter a text');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setPredictedLabel('');
      setConfidence(null);

      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_input': userInput }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setPredictedLabel(data.label_text);
        setConfidence(data.confidence); 
      } else {
        setError('Error predicting label. Please try again.');
      }
    } catch (error) {
      console.error('Error predicting label:', error);
      setError('Error predicting label. The server is probably down at this moment.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md flex flex-col ">
        <img style={{ margin: 'auto' }} src={FilipinoFlag} width="100" height="100" alt="" />
        <h1 className="text-2xl font-semibold mb-4">Filipino Fake News Detector</h1>
        <h1 className="text-xl font-semibold mb-4">ᜉᜒᜎᜒᜉᜒᜈᜓ</h1>
        <label htmlFor="userInput" className="block text-sm font-medium text-gray-600 mb-2">
          Enter Text:
        </label>
        <Textarea
          id="userInput"
          className="w-full px-3 py-5 "
          rows={4}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <Button onClick={predictLabel} disabled={loading}>
          {loading ? 'Detecting...' : 'Detect Fake News'}
        </Button>

        {loading && (
          <img style={{ margin: 'auto' }} width="50" height="50" src={Loading} alt="Loading" />
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
        {!loading && predictedLabel && (
          <div className={`mt-4 text-lg font-semibold ${predictedLabel === "Not Fake News" ? "text-green-500" : "text-red-500"}`}>
            {predictedLabel} {confidence && `(Confidence: ${confidence.toFixed(2)}%)`}
          </div>
        )}
        <hr />
        <div className="mt-2 text-sm font-bold">Important Note!</div>
        <div className="mt-2 text-sm">
          The model used in this web application is not 100% accurate in detecting fake news.
          This app is not meant to replace your own judgment when evaluating information.
        </div>
      </div>
      <div className="mt-2 flex-row">
        <a href="https:www.github.com/johnesleyer">@JohnEsleyer</a>
      </div>
    </div>
  );
}

export default App;
