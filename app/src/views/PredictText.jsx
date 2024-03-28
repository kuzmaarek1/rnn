import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const PredictText = () => {
  const fileInputTxtRef = useRef(null);
  const [txtData, setTxtData] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [responseState, setResponseState] = useState(null);

  const handleTxtSubmission = async () => {
    const file = fileInputTxtRef.current.files[0];
    if (file) {
      const text = await file.text();
      console.log(text);
      const data = JSON.parse(text);
      //setTxtHeaders(Object.keys(data[0]));
      setTxtData(data);
    }
  };
  console.log(txtData);

  const onSubmit = async (data) => {
    console.log({ ...txtData, ...data });
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict/text_classification",
        { ...txtData, ...data }
      );
      console.log(response.data);
      setResponseState(response.data);
    } catch (error) {
      console.error("Błąd podczas wysyłania zapytania POST:", error);
    }
  };

  return (
    <div className="flex gap-[12px]">
      <div>
        <div className="text-[#1c1c1c] font-[14px] font-[600]">Select file</div>
        <div className="bg-[#e3f5ff]  rounded-[16px] custom-box-shadow p-8">
          <input
            type="file"
            className="mb-4"
            ref={fileInputTxtRef}
            accept=".txt"
          />
          <button
            className="relative uppercase spacing tracking-widest font-[400] text-base py-[10px] duration-500 w-[150px] rounded-[16px] border-[2px] border-[#A1E3CB] text-[#1c1c1c] group
            hover:bg-[#A1E3CB] hover:tracking-[0.25em] before:content-[''] before:absolute before:inset-[2px]"
            onClick={handleTxtSubmission}
          >
            <span className="relative z-10 flex justify-center">Submit</span>
            <i
              className="box-shadow-button group-hover:before:w-[8px] group-hover:before:left-[calc(50%)]  group-hover:before:delay-[0.5s]
              before:content-[''] before:absolute  before:w-[10px] before:h-[6px] before:bg-[white] before:border-[2px] before:border-[#A1E3CB] before:top-[-3.5px] before:left-[80%] before:translate-x-[-50%] before:duration-500 before:delay-[0.5s]
              group-hover:after:w-[8px]  group-hover:after:left-[calc(50%)]  group-hover:after:delay-[0.5s]
              after:content-[''] after:absolute after:w-[10px] after:h-[6px] after:bg-[white] after:border-[2px] after:border-[#A1E3CB] after:bottom-[-3.5px] after:left-[20%] after:translate-x-[-50%] after:duration-500 after:delay-[0.5s]"
            ></i>
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="text">Text</label>
        <textarea id="text" name="text" {...register(`text_predict`)} />
        <input type="submit" />
      </form>
      {responseState && <div>{responseState.results}</div>}
    </div>
  );
};

export default PredictText;
