import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Loading from "./assets/loading.svg"
import './App.css'

function App() {
  const [userInput, setUserInput] = useState<string>('');
  const [predictedLabel, setPredictedLabel] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const predictLabel = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_input': userInput }),
      });

      const data = await response.json();
      setPredictedLabel(`Predicted Label: ${data.label_text}`);
    } catch (error) {
      console.error('Error predicting label:', error);
      setError('Error predicting label. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md flex flex-col ">
        <h1 className="text-2xl font-semibold mb-4">Filipino Fake News Detector</h1>
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
        <Button
          className="mt-4"
          onClick={predictLabel}
          disabled={loading}
        >
          Predict
        </Button>
        {loading && <div className="mt-4 flex items-center">
          <img style={{ margin: 'auto' }} width="50" height="50" src={Loading} alt="Loading" />
        </div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}
        {!loading && predictedLabel && (
          <div className="mt-4 text-lg font-semibold">{predictedLabel}</div>
        )}
      </div>
    </div>
  );
}

export default App
