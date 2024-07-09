// Importa as bibliotecas baixadas pelo NPM
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";

// Variáveis que são compartilhadas entre as funções
let components;
let fragmentIfcLoader;
let fragments;
let world;
let model;

// Lista com as funções que serão chamadas pelas janelas do Blazor
(function () {
    window.funcoes = {
        Teste: Teste,
        CarregarIFC: CarregarIFC,
        ConfigurarViewer: ConfigurarViewer,
        ConfigurarCarregamento: ConfigurarCarregamento
    };
})();

// Função teste
function Teste() {
    const container = document.getElementById("container");

    if (container) {
        console.log("Container capturado com sucesso!", container);
    } else {
        console.log("Falha ao capturar o container. Verifique se o elemento com o ID 'container' existe no DOM.");
    }

    return alert('Batata');
}

// Configura o botão de carregamento
function ConfigurarCarregamento() {

    // Obtém o elemento de input da janela
    const input = document.getElementById("file-input");

    // Adiciona um evento ao modificar o input para carregar o IFC
    input.addEventListener(
        "change",

        async (changed) => {
            const file = changed.target.files[0];
            const fileData = await file.arrayBuffer();
            const buffer = new Uint8Array(fileData);

            if (!fragmentIfcLoader) {
                console.error("fragmentIfcLoader não está inicializado. Certifique-se de chamar ConfigurarViewer primeiro.");
                return;
            }

            const model = await fragmentIfcLoader.load(buffer);
            model.name = "Teste";
            world.scene.three.add(model);
        },

        false
    );
}

// Configura a janela de visualização do IFC
async function ConfigurarViewer() {

    console.log("Iniciando função ConfigurarViewer");

    const container = document.getElementById("container");

    if (!container) {
        console.error("Elemento 'container' não encontrado no DOM.");
        return;
    }

    console.log("Elemento 'container' encontrado:", container);

    components = new OBC.Components();

    const worlds = components.get(OBC.Worlds);

    world = worlds.create();

    world.scene = new OBC.SimpleScene(components);
    world.renderer = new OBC.SimpleRenderer(components, container);
    world.camera = new OBC.SimpleCamera(components);

    const grids = components.get(OBC.Grids);
    const grid = grids.create(world);

    components.init();

    const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, material);
    world.scene.three.add(cube);

    world.scene.setup();

    world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);

    fragments = components.get(OBC.FragmentsManager);
    fragmentIfcLoader = components.get(OBC.IfcLoader);

    await fragmentIfcLoader.setup();

    fragmentIfcLoader.settings.webifc = {
        COORDINATE_TO_ORIGIN: true,
        OPTIMIZE_PROFILES: true,
    }

    console.log("Configuração concluída.");
}

// Função teste que carrega o arquivo IFC de exemplo
async function CarregarIFC() {

    console.log("Iniciando função CarregarIFC");

    // Código funcionando que carrega o arquivo Sample
    const file = await fetch(
        "sample-data/SampleHouse4.ifc",
    );
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer);
    model.name = "example";
    world.scene.three.add(model);

    console.log("CarregarIFC concluída.");
}


