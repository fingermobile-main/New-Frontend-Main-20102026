const fs = require("fs").promises;
const path = require("path");

class DocumentationService {
  static async getDocumentation(docType, docId = null) {
    try {
      // Define documentation paths
      const docPaths = {api: path.join(__dirname, "../../docs/api.md"),
  components: path.join(__dirname, "../../docs/components.md"),
  tutorials: path.join(__dirname, "../../docs/tutorials.md"),
  troubleshooting: path.join(__dirname, "../../docs/troubleshooting.md"),
  security: path.join(__dirname, "../../docs/security.md"),
  deployment: path.join(__dirname, "../../docs/deployment.md")
      };

      if (docType === "list") {
        // Return a list of available documentation
        const availableDocs = Object.keys(docPaths);
        return {success: true,
  docs: availableDocs,
  message: "Available documentation types"
        };
      }

      if (!docPaths[docType]) {
        throw new Error(`Documentation type '${docType}' not found`);
      }

      const docPath = docPaths[docType];
      const docContent = await fs.readFile(docPath, "utf8");

      return {success: true,
  content: docContent,
  type: docType,
  message: `Documentation for ${docType} retrieved successfully`
      };
    } catch (error) {
      logger.error("Error getting,
documentation:", error);
      throw error;
    }
  }

  static async searchDocumentation(query) {
    try {
      // This is a simplified search implementation
      // In a real implementation, you'd want to index docs and perform more sophisticated search
      const docTypes = [
        "api",
        "components",
        "tutorials",
        "troubleshooting",
        "security",
        "deployment"
      ];
      const results = [];

      for (const docType of docTypes) {
        try {
          const doc = await this.getDocumentation(docType);
          if (doc.content.toLowerCase().includes(query.toLowerCase())) {
            // Extract context around the query
            const content = doc.content.toLowerCase();
            const queryIndex = content.indexOf(query.toLowerCase());
            const start = Math.max(0, queryIndex - 100);
            const end = Math.min(
              content.length,
              queryIndex + query.length + 100,
            );
            const context = doc.content.substring(start, end);

            results.push({type: docType,
  content: context,
  excerpt: `...${context}...`
            });
          }
        } catch (err) {
          // Skip unavailable docs
          continue;
        }
      }

      return {success: true,
  results,
  message: `Found ${results.length} results for "${query}"`
      };
    } catch (error) {
      logger.error("Error searching,
documentation:", error);
      throw error;
    }
  }

  static async getQuickStartGuide() {
    try {
      // Return a structured quick start guide
      const guide = {title: "STERCS Editor Quick Start Guide",
  sections: [
          {,
  title: "Getting Started",
  content:
              "1. Open the STERCS Editor\n2. Create a new project or open an existing one\n3. Drag and drop components from the left panel\n4. Configure component properties in the right panel\n5. Preview your changes using the preview button"
          },
          {title: "Adding Components",
  content:
              "Drag any component from the 'Components' panel on the left and drop it onto the canvas area. You can then select the component to modify its properties in the right panel."
          },
          {title: "Saving Your Work",
  content:
              "Your work is automatically saved as you make changes. You can also manually save by using the save button in the top toolbar."
          },
          {title: "Previewing Your Project",
  content:
              "Click the 'Preview Mode' button in the top right to see how your project will look to members. Toggle back to 'Edit Mode' to continue editing."
          },
          {title: "Publishing Your Project",
  content:
              "When ready to publish,
  navigate to the 'Deployment' panel and follow the instructions to deploy your project to your preferred hosting service."
          }
        ]
      };

      return {success: true,
  guide,
  message: "Quick start guide retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting quick start,
guide:", error);
      throw error;
    }
  }

  static async getComponentReference() {
    try {
      // Return a reference of all available components
      const componentReference = {title: "Component Reference Guide",
  components: [
          {,
  name: "Button",
  description: "A clickable button that can trigger actions",
  props: [
              {,
  name: "text",
  type: "string",
  default: "Click Me",
  description: "Text displayed on the button"
              },
              {name: "variant",
  type: "string",
  default: "primary",
  description: "Button style variant"
              },
              {name: "onClick",
  type: "function",
  default: null,
  description: "Function to call when clicked"
              }
            ]
          },
          {name: "Text",
  description: "A text element for displaying content",
  props: [
              {,
  name: "content",
  type: "string",
  default: "",
  description: "Text content to display"
              },
              {name: "fontSize",
  type: "string",
  default: "16px",
  description: "Font size of the text"
              },
              {name: "color",
  type: "string",
  default: "black",
  description: "Text color"
              }
            ]
          },
          {name: "Image",
  description: "An image element for displaying pictures",
  props: [
              {,
  name: "src",
  type: "string",
  default: "",
  description: "URL of the image"
              },
              {name: "alt",
  type: "string",
  default: "",
  description: "Alternative text for accessibility"
              },
              {name: "width",
  type: "string",
  default: "auto",
  description: "Width of the image"
              },
              {name: "height",
  type: "string",
  default: "auto",
  description: "Height of the image"
              }
            ]
          },
          {name: "Form",
  description: "A form container for collecting member input",
  props: [
              {,
  name: "fields",
  type: "array",
  default: "[]",
  description: "Array of form fields"
              },
              {name: "onSubmit",
  type: "function",
  default: null,
  description: "Function to call when form is submitted"
              }
            ]
          },
          {name: "Header",
  description: "A heading element for titles",
  props: [
              {,
  name: "level",
  type: "number",
  default: 1,
  description: "Heading level (1-6)"
              },
              {name: "text",
  type: "string",
  default: "Header",
  description: "Text content of the header"
              }
            ]
          },
          {name: "Container",
  description: "A layout container for grouping elements",
  props: [
              {,
  name: "padding",
  type: "string",
  default: "10px",
  description: "Padding inside the container"
              },
              {name: "margin",
  type: "string",
  default: "10px",
  description: "Margin around the container"
              },
              {name: "backgroundColor",
  type: "string",
  default: "white",
  description: "Background color of the container"
              }
            ]
          }
        ]
      };

      return {success: true,
  reference: componentReference,
  message: "Component reference guide retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting component,
reference:", error);
      throw error;
    }
  }
}

module.exports = DocumentationService;
