import { useEffect, useMemo, useState } from "react";
import City from "./interface/ICity";
import ITableData from "./interface/ITableData";

import "./styles/index.css";

const CITIES_OPTIONS: City[] = [
  {
    name: "Berlin",
    latitude: 52.52,
    longitude: 13.41,
    timezone: "Europe",
  },
  {
    name: "Lodon",
    latitude: 51.5002,
    longitude: -0.1262,
    timezone: "Europe",
  },
  {
    name: "Madrid",
    latitude: 40.4167,
    longitude: -3.7033,
    timezone: "Europe",
  },
];

function App() {
  const [select, setSelect] = useState<string>("");
  const [tableData, setTableData] = useState<ITableData[]>([]);

  const selectedCity = useMemo(
    () => CITIES_OPTIONS.find((item) => item.name === select),
    [select]
  );

  useEffect(() => {
    function fetchData() {
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.latitude}&longitude=${selectedCity?.longitude}&hourly=temperature_2m`
      )
        .then((res) => res.json())
        .then((data) => {
          const minTemp = data.hourly.temperature_2m.reduce(
            (a: number, b: number) => Math.min(a, b)
          );

          const maxTemp = data.hourly.temperature_2m.reduce(
            (a: number, b: number) => Math.max(a, b)
          );

          const newData = { name: select, maxTemp, minTemp };

          setTableData([...tableData, newData]);
        });
    }

    if (!!select) {
      fetchData();
    }
  }, [select]);

  const handleChange = (event: any) => {
    setSelect(event.target.value);
  };

  const removeItem = (index: number) => {
    setTableData([...tableData.slice(0, index), ...tableData.slice(index + 1)]);
  };

  return (
    <div className="App">
      <div className="selectContainer">
        <select name="cars" id="cars" value={select} onChange={handleChange}>
          <option value="">Select a city</option>
          {CITIES_OPTIONS.map((city) => {
            return (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="tableContainer">
        <div className="table-header">
          <table>
            <thead>
              <tr>
                <th>City</th>
                <th>Max Temp</th>
                <th>Min Temp</th>
                <th>Options</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="table-content">
          <table>
            <tbody>
              {tableData.map((data, index) => {
                return (
                  <tr key={data.name}>
                    <td>{data.name}</td>
                    <td>{data.maxTemp}</td>
                    <td>{data.minTemp}</td>
                    <td>
                      <button onClick={() => removeItem(index)}>X</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
