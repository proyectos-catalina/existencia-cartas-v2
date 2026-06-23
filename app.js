window.GM_CONFIG = {"title": "Existencia cartas v2", "description": "Cartas IGM Compradas en DSS", "crsName": "EPSG:32719 — WGS 84 / UTM zone 19S", "basemap": "none", "colors": {"primary": "#2c7fb8", "accent": "#f03b20"}, "logo": "assets/logo.jpg", "controls": {"zoom": true, "pan": true, "scale": true, "legend": true, "layers": true, "locate": true, "measure": true, "fullscreen": true, "minimap": true}, "bounds": [[-34.4274049575506, -73.01909786476043], [-32.935090043764674, -69.27028209255624]], "layers": [{"id": "Puntos_a_partir_de_tabla_1cce2b31_b699_4315_9b51_5b9cf4101773", "name": "Huso 18", "kind": "vector", "src": "data/layer_0.js", "dataVar": "GM_LAYER_0", "style": {"geom": "point", "mode": "single", "field": null, "single": {"fill": "#e6111f", "fillOpacity": 1.0, "stroke": "#232323", "weight": 1, "opacity": 1.0, "radius": 4}, "categories": []}, "popupFields": ["fid", "Nombre id", "Id", "Nombre carta", "Seccion", "X_ESTE_MIN", "X_ESTE_MAX", "Y_NORTE_1_MIN", "Y_NORTE_1_MAX", "Proyeccion", "Huso", "Datum ", "Elipsoide", "Escala ", "Codigo Producto IGM", "Existencia Compra", "Cantidad Shp", "Cantidad JPG", "Cantidad Geotiff", "Cantidad Papel "], "roles": {}, "visible": true}, {"id": "Puntos_a_partir_de_tabla_38b44a5f_75e2_4680_9c71_e8fc08d27897", "name": "Huso 19", "kind": "vector", "src": "data/layer_1.js", "dataVar": "GM_LAYER_1", "style": {"geom": "point", "mode": "single", "field": null, "single": {"fill": "#49d7a3", "fillOpacity": 1.0, "stroke": "#232323", "weight": 1, "opacity": 1.0, "radius": 5}, "categories": []}, "popupFields": ["fid", "Id", "Nombre carta", "Seccion", "X_ESTE_MIN", "X_ESTE_MAX", "Y_NORTE_1_MIN", "Y_NORTE_1_MAX", "Proyeccion", "Huso", "Datum ", "Elipsoide", "Escala ", "Codigo Producto IGM", "Hipervinculo ", "Existencia Compra", "Cantidad Shp", "Cantidad JPG", "Cantidad Geotiff", "Cantidad Papel ", "nombre_limpio"], "roles": {}, "visible": true}, {"id": "Cuadr_cula_5828533a_185e_4b17_b054_c3fb1b87f7b6", "name": "20 Km", "kind": "vector", "src": "data/layer_2.js", "dataVar": "GM_LAYER_2", "style": {"geom": "polygon", "mode": "single", "field": null, "single": {"fill": "#7423ff", "fillOpacity": 0.07, "stroke": "#000079", "weight": 3, "opacity": 1.0, "radius": 6}, "categories": []}, "popupFields": ["fid", "id", "left", "top", "right", "bottom", "row_index", "col_index"], "roles": {}, "visible": true}, {"id": "OSM_Standard_85418605_fdd9_4240_90c0_969a8967c829", "name": "OSM Standard", "kind": "raster", "image": "data/raster_3.png", "bounds": [[-85.0511287798066, -180.0], [85.0511287798066, 179.99999999999997]], "opacity": 1.0, "visible": true}]};


(function () {
    var cfg = window.GM_CONFIG;

    var map = L.map('map', {
        zoomControl: !!cfg.controls.zoom,
        dragging: cfg.controls.pan !== false,
        fullscreenControl: false
    });

    // --- Mapa base ---
    var basemaps = {
        osm: {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            opts: { maxZoom: 19, attribution: '&copy; OpenStreetMap' }
        },
        positron: {
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            opts: { maxZoom: 20, attribution: '&copy; OpenStreetMap, &copy; CARTO' }
        },
        dark: {
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            opts: { maxZoom: 20, attribution: '&copy; OpenStreetMap, &copy; CARTO' }
        },
        topo: {
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            opts: { maxZoom: 17, attribution: '&copy; OpenTopoMap (CC-BY-SA)' }
        },
        satellite: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            opts: { maxZoom: 19, attribution: 'Tiles &copy; Esri' }
        }
    };
    var baseLayer = null;
    if (cfg.basemap && cfg.basemap !== 'none' && basemaps[cfg.basemap]) {
        var b = basemaps[cfg.basemap];
        baseLayer = L.tileLayer(b.url, b.opts).addTo(map);
    }

    // --- Estilos ---
    // Cada elemento trae su propio estilo en properties._gm (calculado por el
    // renderizador real de QGIS). Si no, se usa el estilo único de la capa.
    function featStyle(lc, feature) {
        var s = (feature && feature.properties && feature.properties._gm)
            ? feature.properties._gm
            : (lc.style && lc.style.single) || {};
        return {
            color: s.stroke, weight: s.weight, opacity: s.opacity,
            fillColor: s.fill, fillOpacity: s.fillOpacity,
            radius: s.radius || 6
        };
    }

    function videoEmbed(url) {
        var u = String(url);
        var yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
        if (yt) {
            return '<iframe class="gm-media" width="280" height="170" '
                + 'src="https://www.youtube.com/embed/' + yt[1] + '" '
                + 'frameborder="0" allowfullscreen></iframe>';
        }
        if (/vimeo\.com\/(\d+)/.test(u)) {
            var vid = u.match(/vimeo\.com\/(\d+)/)[1];
            return '<iframe class="gm-media" width="280" height="170" '
                + 'src="https://player.vimeo.com/video/' + vid + '" '
                + 'frameborder="0" allowfullscreen></iframe>';
        }
        return '<video class="gm-media" width="280" controls preload="none" src="'
            + u + '"></video>';
    }

    function popupHtml(feature, lc) {
        if (!feature || !feature.properties) { return ''; }
        var p = feature.properties;
        var roles = lc.roles || {};
        var skip = { '_gm': 1 };
        if (roles.image) { skip[roles.image] = 1; }
        if (roles.video) { skip[roles.video] = 1; }

        var rows = '';
        var fields = lc.popupFields || [];
        for (var i = 0; i < fields.length; i++) {
            var k = fields[i];
            if (skip[k]) { continue; }
            var val = p[k];
            if (val === null || val === undefined) { val = ''; }
            if (roles.url && k === roles.url && String(val).trim()) {
                var href = String(val).trim();
                if (!/^https?:\/\//i.test(href)) { href = 'https://' + href; }
                val = '<a href="' + href + '" target="_blank" rel="noopener" '
                    + 'title="Se abrirá en una pestaña nueva">🔗 Abrir enlace ↗</a>'
                    + '<div class="gm-hint">(se abre en otra pestaña)</div>';
            }
            rows += '<tr><td class="k">' + k + '</td><td>' + String(val) + '</td></tr>';
        }

        var media = '';
        if (roles.image && p[roles.image]) {
            media += '<a href="' + String(p[roles.image]) + '" target="_blank" '
                + 'rel="noopener"><img class="gm-media" src="'
                + String(p[roles.image]) + '" alt="imagen"></a>';
        }
        if (roles.video && p[roles.video]) {
            media += videoEmbed(p[roles.video]);
        }
        return '<div class="gm-popup"><table>' + rows + '</table>' + media + '</div>';
    }

    // --- Capas ---
    // cfg.layers viene en el orden de QGIS: índice 0 = capa superior.
    // Cada capa va en su propio "pane" para poder conservar el orden y
    // controlar su transparencia y su posición desde el panel web.
    var gmLayers = [];
    cfg.layers.forEach(function (lc, i) {
        var pane = 'gmpane_' + i;
        map.createPane(pane);
        var layer;
        if (lc.kind === 'raster') {
            layer = L.imageOverlay(lc.image, lc.bounds, { pane: pane });
        } else {
            var data = window[lc.dataVar];
            if (!data) { return; }
            layer = L.geoJSON(data, {
                pane: pane,
                style: function (f) { return featStyle(lc, f); },
                pointToLayer: function (f, latlng) {
                    var st = featStyle(lc, f);
                    return L.circleMarker(latlng, {
                        pane: pane, radius: st.radius,
                        color: st.color, weight: st.weight, opacity: st.opacity,
                        fillColor: st.fillColor, fillOpacity: st.fillOpacity
                    });
                },
                onEachFeature: function (f, lyr) {
                    var html = popupHtml(f, lc);
                    if (html) { lyr.bindPopup(html, { maxWidth: 320 }); }
                }
            });
        }
        layer.addTo(map);
        gmLayers.push({ lc: lc, layer: layer, pane: pane,
                        visible: lc.visible !== false, opacity: 1 });
    });

    // Orden visible: primero del arreglo = capa de arriba.
    var gmOrder = gmLayers.map(function (_g, i) { return i; });

    function gmApplyZ() {
        for (var k = 0; k < gmOrder.length; k++) {
            var gl = gmLayers[gmOrder[k]];
            var p = map.getPane(gl.pane);
            if (p) { p.style.zIndex = 500 + (gmOrder.length - k); }
        }
    }
    function gmApplyVis(gl) {
        var p = map.getPane(gl.pane);
        if (p) { p.style.display = gl.visible ? '' : 'none'; }
    }
    function gmApplyOpacity(gl) {
        var p = map.getPane(gl.pane);
        if (p) { p.style.opacity = gl.opacity; }
    }
    gmApplyZ();
    gmLayers.forEach(function (gl) { gmApplyVis(gl); });

    // --- Encuadre: mismo zoom y límites de la vista de QGIS ---
    if (cfg.bounds) {
        map.fitBounds(cfg.bounds);
    } else {
        map.setView([0, 0], 2);
    }

    // --- Controles ---
    if (cfg.controls.scale) {
        L.control.scale({ imperial: false }).addTo(map);
    }
    if (cfg.controls.layers && gmLayers.length) {
        var layersCtl = L.control({ position: 'topright' });
        layersCtl.onAdd = function () {
            var d = L.DomUtil.create('div', 'gm-layers');
            L.DomEvent.disableClickPropagation(d);
            L.DomEvent.disableScrollPropagation(d);

            function move(k, dir) {
                var nk = k + dir;
                if (nk < 0 || nk >= gmOrder.length) { return; }
                var tmp = gmOrder[k]; gmOrder[k] = gmOrder[nk]; gmOrder[nk] = tmp;
                gmApplyZ();
                render();
            }

            function render() {
                var html = '<h4>Capas</h4>';
                for (var k = 0; k < gmOrder.length; k++) {
                    var idx = gmOrder[k];
                    var gl = gmLayers[idx];
                    html += '<div class="gm-lrow">'
                        + '<div class="gm-lhead">'
                        + '<button class="gm-mv" data-k="' + k + '" data-dir="-1" title="Subir">▲</button>'
                        + '<button class="gm-mv" data-k="' + k + '" data-dir="1" title="Bajar">▼</button>'
                        + '<label><input type="checkbox" class="gm-vis" data-i="' + idx + '"'
                        + (gl.visible ? ' checked' : '') + '> ' + gl.lc.name + '</label>'
                        + '</div>'
                        + '<input type="range" class="gm-op" min="0" max="100" value="'
                        + Math.round(gl.opacity * 100) + '" data-i="' + idx + '">'
                        + '</div>';
                }
                if (baseLayer) {
                    html += '<div class="gm-lrow"><label><input type="checkbox" id="gm-base" checked>'
                        + ' Mapa base</label></div>';
                }
                d.innerHTML = html;

                var mvs = d.querySelectorAll('.gm-mv');
                for (var a = 0; a < mvs.length; a++) {
                    mvs[a].addEventListener('click', function (e) {
                        move(parseInt(e.target.getAttribute('data-k'), 10),
                             parseInt(e.target.getAttribute('data-dir'), 10));
                    });
                }
                var vis = d.querySelectorAll('.gm-vis');
                for (var b = 0; b < vis.length; b++) {
                    vis[b].addEventListener('change', function (e) {
                        var gl = gmLayers[parseInt(e.target.getAttribute('data-i'), 10)];
                        gl.visible = e.target.checked;
                        gmApplyVis(gl);
                    });
                }
                var ops = d.querySelectorAll('.gm-op');
                for (var c = 0; c < ops.length; c++) {
                    ops[c].addEventListener('input', function (e) {
                        var gl = gmLayers[parseInt(e.target.getAttribute('data-i'), 10)];
                        gl.opacity = parseInt(e.target.value, 10) / 100;
                        gmApplyOpacity(gl);
                    });
                }
                var base = d.querySelector('#gm-base');
                if (base) {
                    base.addEventListener('change', function (e) {
                        if (e.target.checked) { map.addLayer(baseLayer); }
                        else { map.removeLayer(baseLayer); }
                    });
                }
            }

            render();
            return d;
        };
        layersCtl.addTo(map);
    }
    if (cfg.controls.fullscreen && L.control.fullscreen) {
        L.control.fullscreen({ title: 'Pantalla completa' }).addTo(map);
    }
    if (cfg.controls.locate && L.control.locate) {
        L.control.locate({
            position: 'topleft',
            strings: { title: 'Mi ubicación (GPS)' },
            flyTo: true
        }).addTo(map);
    }
    if (cfg.controls.measure && L.control.measure) {
        L.control.measure({
            primaryLengthUnit: 'meters', secondaryLengthUnit: 'kilometers',
            primaryAreaUnit: 'sqmeters', secondaryAreaUnit: 'hectares',
            activeColor: cfg.colors.accent, completedColor: cfg.colors.primary,
            localization: 'es'
        }).addTo(map);
    }
    if (cfg.controls.minimap && L.Control && L.Control.MiniMap && baseLayer) {
        var b2 = (function () {
            var bm = basemaps[cfg.basemap] || basemaps.osm;
            return L.tileLayer(bm.url, bm.opts);
        })();
        new L.Control.MiniMap(b2, { toggleDisplay: true }).addTo(map);
    }

    // --- Título ---
    if (cfg.title) {
        var titleCtl = L.control({ position: 'topright' });
        titleCtl.onAdd = function () {
            var d = L.DomUtil.create('div', 'gm-title');
            d.textContent = cfg.title;
            return d;
        };
        titleCtl.addTo(map);
    }

    // --- Leyenda / simbología ---
    if (cfg.controls.legend) {
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function () {
            var d = L.DomUtil.create('div', 'gm-legend');
            var html = '<h4>Leyenda</h4>';
            cfg.layers.forEach(function (lc) {
                if (lc.kind === 'raster') {
                    html += '<div class="row"><span class="swatch" style="background:repeating-linear-gradient(45deg,#bbb,#bbb 4px,#ddd 4px,#ddd 8px)"></span>' + lc.name + '</div>';
                    return;
                }
                var ls = lc.style;
                if (ls.mode === 'categorized' && ls.categories.length) {
                    html += '<div style="font-weight:600;margin-top:4px">' + lc.name + '</div>';
                    ls.categories.forEach(function (c) {
                        html += '<div class="row"><span class="swatch" style="background:' + c.fill + '"></span>' + (c.label || c.value) + '</div>';
                    });
                } else {
                    html += '<div class="row"><span class="swatch" style="background:' + ls.single.fill + '"></span>' + lc.name + '</div>';
                }
            });
            d.innerHTML = html;
            L.DomEvent.disableClickPropagation(d);
            return d;
        };
        legend.addTo(map);
    }

    // --- Logo ---
    if (cfg.logo) {
        var logo = L.control({ position: 'bottomleft' });
        logo.onAdd = function () {
            var d = L.DomUtil.create('div', 'gm-logo');
            d.innerHTML = '<img src="' + cfg.logo + '" alt="logo"/>';
            return d;
        };
        logo.addTo(map);
    }
})();
