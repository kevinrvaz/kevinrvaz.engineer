<script>
  export let circuitTiles = [];
</script>

<div class="circuit-bg">
  <svg class="circuit-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <!-- CYAN Pattern - dark shade -->
      <pattern id="circuit-pattern-cyan" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(0,80,80,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(0,80,80,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(0,80,80,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(0,80,80,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(0,80,80,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(0,80,80,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(0,80,80,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(0,100,100,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <rect x="41" y="41" width="18" height="18" fill="rgba(5,5,15,0.9)" stroke="rgba(0,100,100,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="43" cy="43" r="1.5" fill="rgba(0,100,100,0.8)"/>
        <line x1="37" y1="45" x2="41" y2="45" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="37" y1="50" x2="41" y2="50" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="37" y1="55" x2="41" y2="55" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <line x1="59" y1="45" x2="63" y2="45" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="59" y1="50" x2="63" y2="50" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="59" y1="55" x2="63" y2="55" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <line x1="45" y1="37" x2="45" y2="41" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="50" y1="37" x2="50" y2="41" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="55" y1="37" x2="55" y2="41" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <line x1="45" y1="59" x2="45" y2="63" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="50" y1="59" x2="50" y2="63" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="55" y1="59" x2="55" y2="63" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <rect x="5" y="72" width="12" height="6" fill="rgba(5,5,15,0.9)" stroke="rgba(0,100,100,0.7)" stroke-width="0.8"/>
        <line x1="7" y1="70" x2="7" y2="72" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="11" y1="70" x2="11" y2="72" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="15" y1="70" x2="15" y2="72" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <line x1="7" y1="78" x2="7" y2="85" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="11" y1="78" x2="11" y2="85" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="15" y1="78" x2="15" y2="85" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <line x1="7" y1="70" x2="7" y2="50" stroke="rgba(0,80,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <rect x="75" y="70" width="4" height="8" fill="rgba(0,100,100,0.6)" stroke="rgba(0,120,120,0.8)" stroke-width="0.5"/>
        <line x1="77" y1="70" x2="77" y2="50" stroke="rgba(0,80,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="77" y1="78" x2="77" y2="90" stroke="rgba(0,80,80,0.5)" stroke-width="1"/>
        <rect x="85" y="5" width="10" height="4" fill="rgba(5,5,15,0.8)" stroke="rgba(0,80,80,0.6)" stroke-width="0.5"/>
        <line x1="80" y1="7" x2="85" y2="7" stroke="rgba(0,80,80,0.6)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="95" y1="7" x2="100" y2="7" stroke="rgba(0,80,80,0.6)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.8s" repeatCount="indefinite"/></line>
      </pattern>

      <!-- MAGENTA Pattern - dark shade -->
      <pattern id="circuit-pattern-magenta" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(80,0,80,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(80,0,80,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(80,0,80,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(80,0,80,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(80,0,80,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(80,0,80,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(80,0,80,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(100,0,100,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <rect x="45" y="45" width="10" height="10" fill="rgba(5,5,15,0.9)" stroke="rgba(100,0,100,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="47" cy="47" r="1" fill="rgba(100,0,100,0.8)"/>
        <line x1="41" y1="47" x2="45" y2="47" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="41" y1="53" x2="45" y2="53" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <line x1="55" y1="47" x2="59" y2="47" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="55" y1="53" x2="59" y2="53" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <line x1="47" y1="41" x2="47" y2="45" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="53" y1="41" x2="53" y2="45" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <line x1="47" y1="55" x2="47" y2="59" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="53" y1="55" x2="53" y2="59" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <rect x="3" y="3" width="16" height="16" fill="rgba(5,5,15,0.8)" stroke="rgba(100,0,100,0.6)" stroke-width="0.5"/>
        <circle cx="8" cy="8" r="2" fill="rgba(100,0,100,0.5)"/><circle cx="14" cy="8" r="2" fill="rgba(100,0,100,0.5)"/>
        <circle cx="8" cy="14" r="2" fill="rgba(100,0,100,0.5)"/><circle cx="14" cy="14" r="2" fill="rgba(100,0,100,0.5)"/>
        <line x1="8" y1="19" x2="8" y2="25" stroke="rgba(80,0,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="14" y1="19" x2="14" y2="20" stroke="rgba(80,0,80,0.5)" stroke-width="1"/><line x1="14" y1="20" x2="20" y2="20" stroke="rgba(80,0,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.9s" repeatCount="indefinite"/></line>
        <rect x="75" y="75" width="8" height="5" fill="rgba(5,5,15,0.9)" stroke="rgba(100,0,100,0.7)" stroke-width="0.5"/>
        <line x1="77" y1="80" x2="77" y2="90" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <line x1="79" y1="80" x2="79" y2="85" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="79" y1="85" x2="90" y2="85" stroke="rgba(80,0,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="81" y1="80" x2="81" y2="90" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <line x1="70" y1="50" x2="75" y2="50" stroke="rgba(80,0,80,0.5)" stroke-width="1"/><line x1="75" y1="50" x2="75" y2="75" stroke="rgba(80,0,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <rect x="85" y="25" width="6" height="10" fill="rgba(100,0,100,0.3)" stroke="rgba(100,0,100,0.7)" stroke-width="0.8" rx="1"/>
        <line x1="88" y1="20" x2="88" y2="25" stroke="rgba(80,0,80,0.6)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="88" y1="35" x2="88" y2="40" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="88" y1="40" x2="80" y2="40" stroke="rgba(80,0,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
      </pattern>

      <!-- YELLOW Pattern - dark shade (olive/gold) -->
      <pattern id="circuit-pattern-yellow" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(80,80,0,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(80,80,0,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(80,80,0,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(80,80,0,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(80,80,0,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(80,80,0,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(80,80,0,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(100,100,0,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <rect x="39" y="39" width="22" height="22" fill="rgba(5,5,15,0.9)" stroke="rgba(100,100,0,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="42" cy="42" r="2" fill="rgba(100,100,0,0.8)"/>
        <line x1="34" y1="44" x2="39" y2="44" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="34" y1="50" x2="39" y2="50" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="34" y1="56" x2="39" y2="56" stroke="rgba(80,80,0,0.6)" stroke-width="1"/>
        <line x1="61" y1="44" x2="66" y2="44" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="61" y1="50" x2="66" y2="50" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="61" y1="56" x2="66" y2="56" stroke="rgba(80,80,0,0.6)" stroke-width="1"/>
        <line x1="44" y1="34" x2="44" y2="39" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="50" y1="34" x2="50" y2="39" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="56" y1="34" x2="56" y2="39" stroke="rgba(80,80,0,0.6)" stroke-width="1"/>
        <line x1="44" y1="61" x2="44" y2="66" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="50" y1="61" x2="50" y2="66" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="56" y1="61" x2="56" y2="66" stroke="rgba(80,80,0,0.6)" stroke-width="1"/>
      </pattern>

      <!-- RED Pattern - dark shade (maroon) -->
      <pattern id="circuit-pattern-red" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(100,20,20,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(100,20,20,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(100,20,20,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(100,20,20,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(100,20,20,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(100,20,20,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(100,20,20,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(120,30,30,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <rect x="43" y="43" width="14" height="14" fill="rgba(5,5,15,0.9)" stroke="rgba(120,30,30,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="45" cy="45" r="1.2" fill="rgba(120,30,30,0.8)"/>
        <line x1="39" y1="46" x2="43" y2="46" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="39" y1="50" x2="43" y2="50" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="39" y1="54" x2="43" y2="54" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <line x1="57" y1="46" x2="61" y2="46" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="57" y1="50" x2="61" y2="50" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="57" y1="54" x2="61" y2="54" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <line x1="46" y1="39" x2="46" y2="43" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="50" y1="39" x2="50" y2="43" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="54" y1="39" x2="54" y2="43" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <line x1="46" y1="57" x2="46" y2="61" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="50" y1="57" x2="50" y2="61" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="54" y1="57" x2="54" y2="61" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <rect x="5" y="5" width="16" height="16" fill="rgba(5,5,15,0.7)" stroke="rgba(120,30,30,0.6)" stroke-width="1"/>
        <rect x="7" y="7" width="12" height="12" fill="rgba(15,5,5,0.9)" stroke="rgba(120,30,30,0.8)" stroke-width="0.5"/>
        <circle cx="9" cy="9" r="1" fill="rgba(120,30,30,0.7)"/>
        <line x1="21" y1="10" x2="30" y2="10" stroke="rgba(100,20,20,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="30" y1="10" x2="30" y2="20" stroke="rgba(100,20,20,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="13" y1="21" x2="13" y2="30" stroke="rgba(100,20,20,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.1s" repeatCount="indefinite"/></line>
        <circle cx="85" cy="85" r="6" fill="rgba(5,5,15,0.8)" stroke="rgba(120,30,30,0.7)" stroke-width="1"/>
        <line x1="83" y1="85" x2="87" y2="85" stroke="rgba(120,30,30,0.5)" stroke-width="0.5"/>
        <line x1="85" y1="79" x2="85" y2="70" stroke="rgba(100,20,20,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="85" y1="70" x2="80" y2="70" stroke="rgba(100,20,20,0.5)" stroke-width="1"/><line x1="80" y1="70" x2="80" y2="50" stroke="rgba(100,20,20,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="85" y1="91" x2="85" y2="95" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <polygon points="10,75 18,80 10,85" fill="rgba(120,30,30,0.5)" stroke="rgba(120,30,30,0.7)" stroke-width="0.5"/>
        <line x1="18" y1="75" x2="18" y2="85" stroke="rgba(120,30,30,0.7)" stroke-width="1"/>
        <line x1="5" y1="80" x2="10" y2="80" stroke="rgba(100,20,20,0.5)" stroke-width="1"/>
        <line x1="0" y1="80" x2="5" y2="80" stroke="rgba(100,20,20,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="18" y1="80" x2="25" y2="80" stroke="rgba(100,20,20,0.5)" stroke-width="1"/><line x1="25" y1="80" x2="25" y2="50" stroke="rgba(100,20,20,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
      </pattern>

      <!-- BLUE Pattern - dark shade (navy) -->
      <pattern id="circuit-pattern-blue" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(30,40,100,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(30,40,100,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(30,40,100,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(30,40,100,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(30,40,100,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(30,40,100,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(30,40,100,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(40,50,120,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <rect x="40" y="40" width="20" height="20" fill="rgba(5,5,15,0.9)" stroke="rgba(40,50,120,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="43" cy="43" r="1.8" fill="rgba(40,50,120,0.8)"/>
        <line x1="35" y1="44" x2="40" y2="44" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="35" y1="50" x2="40" y2="50" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="35" y1="56" x2="40" y2="56" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <line x1="60" y1="44" x2="65" y2="44" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="60" y1="50" x2="65" y2="50" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="60" y1="56" x2="65" y2="56" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <line x1="44" y1="35" x2="44" y2="40" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="50" y1="35" x2="50" y2="40" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="56" y1="35" x2="56" y2="40" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <line x1="44" y1="60" x2="44" y2="65" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="50" y1="60" x2="50" y2="65" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="56" y1="60" x2="56" y2="65" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <rect x="5" y="75" width="14" height="8" fill="rgba(5,5,15,0.9)" stroke="rgba(40,50,120,0.7)" stroke-width="1" rx="1"/>
        <rect x="7" y="77" width="10" height="4" fill="rgba(30,40,100,0.4)" stroke="none"/>
        <line x1="12" y1="75" x2="12" y2="70" stroke="rgba(30,40,100,0.5)" stroke-width="1"/><line x1="12" y1="70" x2="20" y2="70" stroke="rgba(30,40,100,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="12" y1="83" x2="12" y2="90" stroke="rgba(30,40,100,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="19" y1="79" x2="30" y2="79" stroke="rgba(30,40,100,0.5)" stroke-width="1"/><line x1="30" y1="79" x2="30" y2="50" stroke="rgba(30,40,100,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <rect x="80" y="5" width="15" height="10" fill="rgba(5,5,15,0.9)" stroke="rgba(40,50,120,0.7)" stroke-width="1"/>
        <rect x="82" y="3" width="11" height="4" fill="rgba(30,40,100,0.3)" stroke="rgba(40,50,120,0.5)" stroke-width="0.5"/>
        <line x1="84" y1="15" x2="84" y2="20" stroke="rgba(30,40,100,0.6)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="88" y1="15" x2="88" y2="20" stroke="rgba(30,40,100,0.6)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="92" y1="15" x2="92" y2="20" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="92" y1="20" x2="100" y2="20" stroke="rgba(30,40,100,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite"/></line>
        <path d="M5,5 Q8,2 11,5 Q14,8 17,5 Q20,2 23,5" fill="none" stroke="rgba(40,50,120,0.7)" stroke-width="1.5"/>
        <line x1="0" y1="5" x2="5" y2="5" stroke="rgba(30,40,100,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="23" y1="5" x2="30" y2="5" stroke="rgba(30,40,100,0.5)" stroke-width="1"/><line x1="30" y1="5" x2="30" y2="20" stroke="rgba(30,40,100,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
      </pattern>

      <!-- ORANGE Pattern - dark shade (burnt orange/brown) -->
      <pattern id="circuit-pattern-orange" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(100,50,0,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(100,50,0,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(100,50,0,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(100,50,0,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(100,50,0,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(100,50,0,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(100,50,0,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(120,60,0,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <rect x="44" y="44" width="12" height="12" fill="rgba(5,5,15,0.9)" stroke="rgba(120,60,0,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="46" cy="46" r="1" fill="rgba(120,60,0,0.8)"/>
        <line x1="40" y1="47" x2="44" y2="47" stroke="rgba(100,50,0,0.6)" stroke-width="1"/><line x1="40" y1="53" x2="44" y2="53" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="56" y1="47" x2="60" y2="47" stroke="rgba(100,50,0,0.6)" stroke-width="1"/><line x1="56" y1="53" x2="60" y2="53" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="47" y1="40" x2="47" y2="44" stroke="rgba(100,50,0,0.6)" stroke-width="1"/><line x1="53" y1="40" x2="53" y2="44" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="47" y1="56" x2="47" y2="60" stroke="rgba(100,50,0,0.6)" stroke-width="1"/><line x1="53" y1="56" x2="53" y2="60" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <rect x="5" y="5" width="20" height="12" fill="rgba(5,5,15,0.9)" stroke="rgba(120,60,0,0.7)" stroke-width="1"/>
        <circle cx="8" cy="8" r="1" fill="rgba(120,60,0,0.7)"/>
        <line x1="8" y1="17" x2="8" y2="25" stroke="rgba(100,50,0,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="12" y1="17" x2="12" y2="20" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="16" y1="17" x2="16" y2="25" stroke="rgba(100,50,0,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="20" y1="17" x2="20" y2="20" stroke="rgba(100,50,0,0.6)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="25" y1="11" x2="35" y2="11" stroke="rgba(100,50,0,0.5)" stroke-width="1"/><line x1="35" y1="11" x2="35" y2="20" stroke="rgba(100,50,0,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <circle cx="85" cy="85" r="4" fill="rgba(120,60,0,0.4)" stroke="rgba(120,60,0,0.8)" stroke-width="1"/>
        <circle cx="85" cy="85" r="2" fill="rgba(150,80,0,0.6)"/>
        <line x1="85" y1="89" x2="85" y2="95" stroke="rgba(100,50,0,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="83" y1="89" x2="83" y2="92" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="85" y1="81" x2="85" y2="70" stroke="rgba(100,50,0,0.5)" stroke-width="1"/><line x1="85" y1="70" x2="80" y2="70" stroke="rgba(100,50,0,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite"/></line>
        <line x1="80" y1="70" x2="80" y2="50" stroke="rgba(100,50,0,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.1s" repeatCount="indefinite"/></line>
        <rect x="75" y="5" width="8" height="4" fill="rgba(120,60,0,0.3)" stroke="rgba(120,60,0,0.6)" stroke-width="0.5" rx="1"/>
        <line x1="70" y1="7" x2="75" y2="7" stroke="rgba(100,50,0,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="83" y1="7" x2="90" y2="7" stroke="rgba(100,50,0,0.5)" stroke-width="1"/><line x1="90" y1="7" x2="90" y2="20" stroke="rgba(100,50,0,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
      </pattern>

      <!-- Glow filters -->
      <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="glow-magenta" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- Electric pulse gradients -->
      <linearGradient id="electric-pulse-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00ffff" stop-opacity="0">
          <animate attributeName="offset" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
        </stop>
        <stop offset="15%" stop-color="#00ffff" stop-opacity="1">
          <animate attributeName="offset" values="0.15;1;0.15" dur="1.5s" repeatCount="indefinite"/>
        </stop>
        <stop offset="30%" stop-color="#00ffff" stop-opacity="0">
          <animate attributeName="offset" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
        </stop>
      </linearGradient>

      <linearGradient id="electric-pulse-magenta" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ff00ff" stop-opacity="0">
          <animate attributeName="offset" values="0;1;0" dur="2s" repeatCount="indefinite"/>
        </stop>
        <stop offset="20%" stop-color="#ff00ff" stop-opacity="1">
          <animate attributeName="offset" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/>
        </stop>
        <stop offset="40%" stop-color="#ff00ff" stop-opacity="0">
          <animate attributeName="offset" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
        </stop>
      </linearGradient>
    </defs>

    <!-- Background pattern tiles -->
    {#each circuitTiles.filter(t => t.visible) as tile (tile.id)}
      <rect
        x={tile.x}
        y={tile.y}
        width="100"
        height="100"
        fill="url(#circuit-pattern-{tile.colorScheme})"
        style="opacity: {tile.opacity};"
      />
    {/each}

    <!-- Animated electric currents -->
    <g class="electric-paths">
      <path class="circuit-path path-1"
            d="M0,20 L40,20 L50,20 L50,30 L50,70 L50,80 L60,80 L100,80"
            fill="none" stroke="#00ffff" stroke-width="2" filter="url(#glow-cyan)"
            stroke-dasharray="20 180" stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="200" to="0" dur="3s" repeatCount="indefinite"/>
      </path>
      <path class="circuit-path path-2"
            d="M20,0 L20,20 L20,40 L20,100"
            fill="none" stroke="#ff00ff" stroke-width="2" filter="url(#glow-magenta)"
            stroke-dasharray="15 135" stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="150" to="0" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
      </path>
      <path class="circuit-path path-3"
            d="M100,20 L80,20 L80,50 L80,60 L70,60 L50,60 L50,50"
            fill="none" stroke="#00ffff" stroke-width="2" filter="url(#glow-cyan)"
            stroke-dasharray="18 162" stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="180" to="0" dur="4s" repeatCount="indefinite" begin="1s"/>
      </path>
      <path class="circuit-path path-4"
            d="M0,50 L30,50 L50,50 L70,50 L100,50"
            fill="none" stroke="#00ffff" stroke-width="2" filter="url(#glow-cyan)"
            stroke-dasharray="25 175" stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="0" to="200" dur="3.5s" repeatCount="indefinite" begin="1.5s"/>
      </path>
      <path class="circuit-path path-5"
            d="M80,100 L80,80 L80,70 L80,50 L80,0"
            fill="none" stroke="#ff00ff" stroke-width="2" filter="url(#glow-magenta)"
            stroke-dasharray="12 138" stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="150" to="0" dur="2.8s" repeatCount="indefinite" begin="2s"/>
      </path>
      <path class="circuit-path path-6"
            d="M50,30 L50,50 L50,70"
            fill="none" stroke="#00ffff" stroke-width="2" filter="url(#glow-cyan)"
            stroke-dasharray="10 90" stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" begin="0.8s"/>
      </path>
    </g>

    <!-- Traveling electricity sparks -->
    <g class="electricity-sparks">
      <circle r="3" fill="#00ffff" filter="url(#glow-cyan)">
        <animateMotion dur="2s" repeatCount="indefinite" path="M0,20 L40,20 L50,20 L50,30 L50,70 L50,80 L60,80 L100,80"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="2;4;2" dur="0.3s" repeatCount="indefinite"/>
      </circle>
      <circle r="3" fill="#ff00ff" filter="url(#glow-magenta)">
        <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.5s" path="M20,0 L20,20 L20,40 L20,100"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="1.8s" repeatCount="indefinite" begin="0.5s"/>
        <animate attributeName="r" values="2;4;2" dur="0.25s" repeatCount="indefinite"/>
      </circle>
      <circle r="3" fill="#00ffff" filter="url(#glow-cyan)">
        <animateMotion dur="2.5s" repeatCount="indefinite" begin="1s" path="M100,20 L80,20 L80,50 L80,60 L70,60 L50,60 L50,50"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" repeatCount="indefinite" begin="1s"/>
        <animate attributeName="r" values="2;4;2" dur="0.35s" repeatCount="indefinite"/>
      </circle>
      <circle r="3" fill="#00ffff" filter="url(#glow-cyan)">
        <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.5s" path="M100,50 L70,50 L50,50 L30,50 L0,50"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" repeatCount="indefinite" begin="1.5s"/>
        <animate attributeName="r" values="2;4;2" dur="0.28s" repeatCount="indefinite"/>
      </circle>
      <circle r="3" fill="#ff00ff" filter="url(#glow-magenta)">
        <animateMotion dur="1.6s" repeatCount="indefinite" begin="2s" path="M80,100 L80,80 L80,70 L80,50 L80,0"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="1.6s" repeatCount="indefinite" begin="2s"/>
        <animate attributeName="r" values="2;4;2" dur="0.22s" repeatCount="indefinite"/>
      </circle>
    </g>

    <!-- Animated glowing nodes -->
    <g class="pulse-nodes">
      <circle cx="20" cy="20" r="4" fill="#00ffff" filter="url(#glow-cyan)">
        <animate attributeName="r" values="3;8;3" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="50" r="5" fill="#ff00ff" filter="url(#glow-magenta)">
        <animate attributeName="r" values="4;9;4" dur="2s" repeatCount="indefinite" begin="0.3s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <circle cx="80" cy="20" r="3" fill="#00ffff" filter="url(#glow-cyan)">
        <animate attributeName="r" values="2;7;2" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
      </circle>
      <circle cx="80" cy="80" r="4" fill="#00ffff" filter="url(#glow-cyan)">
        <animate attributeName="r" values="3;8;3" dur="1.6s" repeatCount="indefinite" begin="1s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" begin="1s"/>
      </circle>
      <circle cx="50" cy="80" r="3" fill="#ff00ff" filter="url(#glow-magenta)">
        <animate attributeName="r" values="2;7;2" dur="1.4s" repeatCount="indefinite" begin="1.5s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" begin="1.5s"/>
      </circle>

      <!-- Expanding spark rings -->
      <circle cx="20" cy="20" r="6" fill="none" stroke="#00ffff" stroke-width="2" filter="url(#glow-cyan)">
        <animate attributeName="r" values="4;14;4" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="stroke-width" values="2;0;2" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="50" r="6" fill="none" stroke="#ff00ff" stroke-width="2" filter="url(#glow-magenta)">
        <animate attributeName="r" values="5;16;5" dur="2s" repeatCount="indefinite" begin="0.3s"/>
        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" begin="0.3s"/>
        <animate attributeName="stroke-width" values="2;0;2" dur="2s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <circle cx="80" cy="20" r="5" fill="none" stroke="#00ffff" stroke-width="2" filter="url(#glow-cyan)">
        <animate attributeName="r" values="3;12;3" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
        <animate attributeName="stroke-width" values="2;0;2" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
      </circle>
    </g>
  </svg>
</div>

<style>
  .circuit-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    overflow: visible;
  }

  .circuit-svg {
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }

  .electric-paths {
    opacity: 0.9;
  }

  .circuit-path {
    opacity: 0.8;
  }

  .pulse-nodes circle {
    opacity: 0.9;
  }
</style>
