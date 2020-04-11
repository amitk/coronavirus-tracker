import React, { useRef } from "react";
import axios from "axios";
import Helmet from "react-helmet";
import L from "leaflet";

import Layout from "components/Layout";
import Map from "components/Map";

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const getData = () => {
  return axios.get("https://corona.lmao.ninja/countries");
};

const IndexPage = () => {
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    let response;

    try {
      axios.get("https://corona.lmao.ninja/countries").then(res => {
        response = res;
        const { data = [] } = response;
        const hasData = Array.isArray(data) && data.length > 0;
        if (!hasData) return;
        data.push({
          updated: 1586499601723,
          country: "Avinash",
          countryInfo: {
            _id: 1,
            iso2: "AV",
            iso3: "AVI",
            lat: 18.5204,
            long: 73.8567
          },
          cases: 1,
          todayCases: 0,
          deaths: 0,
          todayDeaths: 0,
          recovered: 0,
          active: 0,
          critical: 0,
          casesPerOneMillion: 0,
          deathsPerOneMillion: 0,
          tests: 0,
          testsPerOneMillion: 0
        });
        const geoJSON = {
          type: "FeatureCollection",
          features: data.map((country = {}) => {
            const { countryInfo = {} } = country;
            const { lat, long: lng } = countryInfo;
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lng, lat]
              },
              properties: { ...country }
            };
          })
        };
        const geoJSONLayer = new L.geoJSON(geoJSON, {
          pointToLayer: (feature = {}, latlng) => {
            const { properties = {} } = feature;
            let updatedFormatted;
            let casesString;

            const { country, updated, cases, deaths, recovered } = properties;

            casesString = `${cases}`;

            if (cases > 1000) casesString = `${casesString.slice(0, -3)}k+`;

            if (updated) updatedFormatted = new Date(updated).toLocaleString();
            console.log("world");
            let html =
              country !== "Avinash"
                ? `
              <span class="icon-marker">
                <span class="icon-marker-tooltip">
                  <h2>${country}</h2>
                  <ul>
                    <li><strong>Confirmed:</strong> ${cases}</li>
                    <li><strong>Deaths:</strong> ${deaths}</li>
                    <li><strong>Recovered:</strong> ${recovered}</li>
                    <li><strong>Last Update:</strong> ${updatedFormatted}</li>
                  </ul>
                </span>
                ${casesString}
              </span>
            `
                : `
            <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>IN LOVE</h2>
              <ul>
                <li><strong>Confirmed:</strong>1</li>
                <li><strong>Dead:</strong> NO</li>
                <li><strong>Recovered:</strong> UNABLE TO RECOVER</li>
                <li><strong>Last Update:</strong> WHEN YOU WHERE IN SIGHT</li>
              </ul>
            </span>
            ${casesString}
          </span>`;

            return L.marker(latlng, {
              icon: L.divIcon({
                className: "icon",
                html
              }),
              riseOnHover: true
            });
          }
        });
        geoJSONLayer.addTo(map);
      });
      // console.log(response);
    } catch (e) {
      console.log(`Unable to fetch coronavirus data, due to${e.message}`, e);
      return;
    }
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings}></Map>
    </Layout>
  );
};

export default IndexPage;
