import { PanelDisplay, useModelData } from '@nextstrain/evofr-viz';
import '@nextstrain/evofr-viz/dist/index.css';

const customAddress = !!import.meta.env.VITE_DATA_HOST;
const mlrCladesConfig = {
    modelName: "mlr_clades",
    modelUrl: customAddress ?
      `${import.meta.env.VITE_DATA_HOST}/${import.meta.env.VITE_CLADES_PATH}` :
      `https://bbi-sfa-covidforecasting-dashboard-ui.s3.us-west-2.amazonaws.com/data/us_states/us_nextstrain_clades.json`
}
const mlrLineagesConfig = {
    modelName: "mlr_lineages",
    modelUrl: customAddress ?
      `${import.meta.env.VITE_DATA_HOST}/${import.meta.env.VITE_LINEAGES_PATH}` :
      `https://bbi-sfa-covidforecasting-dashboard-ui.s3.us-west-2.amazonaws.com/data/us_states/us_pango_lineages.json`
}

function App() {

  const mlrCladesData = useModelData(mlrCladesConfig);
  const mlrLineagesData = useModelData(mlrLineagesConfig);

  const mlrCladesPivotRaw = mlrCladesData?.modelData?.get('pivot') || "loading";
  const mlrCladesPivot = mlrCladesData?.modelData?.get('variantDisplayNames')?.get(mlrCladesPivotRaw) || mlrCladesPivotRaw;
  const mlrLineagesPivot = mlrLineagesData?.modelData?.get('pivot') || "loading";

  const cladesLocationsFiltered = mlrCladesData?.modelData?.get('locations')?.filter((loc)=>loc!=='hierarchical') || [];
  const lineagesLocationsFiltered = mlrLineagesData?.modelData?.get('locations')?.filter((loc)=>loc!=='hierarchical') || [];

  return (
    <div className="App">

      <div id="mainPanelsContainer">
        <h2>Clade frequencies over time</h2>
        <p>
          Each line represents the estimated frequency of a particular clade through time.
          Equivalent Pango lineage is given in parenthesis, eg clade 23A (lineage XBB.1.5). Only
          locations with more than 45 sequences from samples collected in the previous 120 days are
          included. Results last updated {mlrCladesData?.modelData?.get('updated') || 'loading'}.
        </p>
        <div id="cladeFrequenciesPanel" class="panelDisplay"> {/* surrounding div(s) used for static-images.js script */}
          <PanelDisplay data={mlrCladesData} locations={cladesLocationsFiltered} params={{preset: "frequency"}}/>
        </div>

        <h2>Clade growth advantage</h2>
        <p>
          These plots show the estimated growth advantage for given clades relative to clade {mlrCladesPivot} (lineage {mlrLineagesPivot}). 
          A variant’s growth advantage describes how many more secondary infections it causes on average relative 
          to clade {mlrCladesPivot}. Vertical bars show the 95% highest (posterior) density interval (HDI). The "hierarchical" panel 
          shows pooled estimates of growth rates across different states.
          Results last updated {mlrCladesData?.modelData?.get('updated') || 'loading'}.
        </p>
        <div id="cladeGrowthAdvantagePanel" class="panelDisplay">
          <PanelDisplay data={mlrCladesData} params={{preset: "growthAdvantage"}}/>
        </div>

        <h2>Lineage frequencies over time</h2>
        <p>
          Each line represents the estimated frequency of a particular Pango lineage through time.
          Lineages with fewer than 200 observations are collapsed into parental lineage. Only
          locations with more than 45 sequences from samples collected in the previous 120 days are
          included. Results last updated {mlrLineagesData?.modelData?.get('updated') || 'loading'}.
        </p>
        <div id="lineageFrequenciesPanel" class="panelDisplay">
          <PanelDisplay data={mlrLineagesData} locations={lineagesLocationsFiltered} params={{preset: "frequency"}}/>
        </div>

        <h2>Lineage growth advantage</h2>
        <p>
          These plots show the estimated growth advantage for given Pango lineages relative to lineage {mlrLineagesPivot}. 
          A lineage’s growth advantage describes how many more secondary infections it causes on average relative 
          to lineage {mlrLineagesPivot}. Vertical bars show the 95% highest (posterior) density interval (HDI). The "hierarchical" 
          panel shows pooled estimates of growth rates across different states. 
          Results last updated {mlrLineagesData?.modelData?.get('updated') || 'loading'}.
        </p>
        <div id="lineageGrowthAdvantagePanel" class="panelDisplay">
          <PanelDisplay data={mlrLineagesData} params={{preset: "growthAdvantage"}}/>
        </div>

      </div>
    </div>
  )
}

export default App
