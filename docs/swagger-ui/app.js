// Переключение между REST-спецификациями (Swagger UI) и событиями Kafka (AsyncAPI UI).

(function () {
  "use strict";

  var select = document.getElementById("spec-select");
  var swaggerRoot = document.getElementById("swagger-root");
  var asyncapiRoot = document.getElementById("asyncapi-root");

  // Каждая сборка монтируется в свой div: и Swagger UI, и AsyncAPI-компонент
  // держат внутреннее состояние, поэтому чистую переустановка надёжнее повторного рендера.
  var mountSerial = 0;

  function renderSwagger(spec) {
    swaggerRoot.hidden = false;
    asyncapiRoot.hidden = true;
    asyncapiRoot.textContent = "";
    swaggerRoot.textContent = "";

    var node = document.createElement("div");
    node.id = "swagger-ui-" + ++mountSerial;
    swaggerRoot.appendChild(node);

    window.SwaggerUIBundle({
      spec: spec,
      domNode: node,
      docExpansion: "list",
      defaultModelsExpandDepth: 1,
      tryItOutEnabled: false,
      supportedSubmitMethods: [],
      presets: [window.SwaggerUIBundle.presets.apis],
    });
  }

  function renderAsyncApi(spec) {
    swaggerRoot.hidden = true;
    asyncapiRoot.hidden = false;
    swaggerRoot.textContent = "";

    var node = document.createElement("div");
    node.id = "asyncapi-ui-" + ++mountSerial;
    asyncapiRoot.appendChild(node);

    window.AsyncApiStandalone.render(
      {
        schema: spec,
        config: {
          show: {
            sidebar: true,
            servers: true,
            operations: true,
            messages: true,
          },
        },
      },
      node
    );
  }

  function onSelectionChange() {
    var id = select.value;
    if (window.OPENAPI_SPECS[id]) {
      renderSwagger(window.OPENAPI_SPECS[id]);
    } else if (window.ASYNC_API_SPECS[id]) {
      renderAsyncApi(window.ASYNC_API_SPECS[id]);
    }
  }

  select.addEventListener("change", onSelectionChange);
  onSelectionChange();
})();
