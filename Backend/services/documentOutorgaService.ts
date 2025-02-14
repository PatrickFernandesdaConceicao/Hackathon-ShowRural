import pdf from "pdf-parse";
import { DocumentFileRepositorie } from "../repositorie/documentFileRepositorie";
import { DocumentOutorgaPdf } from "../entities/documentOutorga";

export class DocumentOutorgaService {
    static async getAll(data: DocumentOutorgaPdf) {
        try {
            if (!data.documentOutorga_pdf) {
                throw new Error("Arquivo PDF inválido ou não fornecido.");
            }

            // Converte Uint8Array para Buffer
            const buffer = Buffer.from(data.documentOutorga_pdf);

            // Extrai texto do PDF
            const pdfData = await pdf(buffer);
            const extractedText = pdfData.text;

            // Extrai as informações relevantes
            const extractedData = extractRelevantInfo(extractedText);

            console.log(extractedData); // Exibe os dados extraídos

            return extractedData;
        } catch (error) {
            console.error("Erro ao processar PDF:", error);
            throw new Error("Falha ao processar o arquivo PDF.");
        }
    }
}

// Função para extrair dados relevantes usando regex

function extractRelevantInfo(text: string) {
    // Divide o texto em linhas
    const lines = text.split('\n');

    // Objeto para armazenar os dados extraídos
    const extractedData: { [key: string]: string | null } = {
        numeroProtocolo: null, // Novo campo para o número de protocolo
        validade: null,
        nomeRazaoSocial: null,
        cpfCnpj: null,
        condicoes: null,
    };

    // Regex para capturar o Número de Protocolo (padrão: "18.284.536-1")
    const protocoloRegex = /\b\d{2}\.\d{3}\.\d{3}-\d{1}\b/;
    // Regex para capturar a Validade (padrão: "16/12/2027")
    const validadeRegex = /\b\d{2}\/\d{2}\/\d{4}\b/;
    // Regex para capturar CPF/CNPJ (padrão: "76.098.219/0021-80")
    const cpfCnpjRegex = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/;

    // Itera sobre as linhas para extrair os dados
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Captura o Número de Protocolo
        const protocoloMatch = line.match(protocoloRegex);
        if (protocoloMatch && !extractedData.numeroProtocolo) {
            extractedData.numeroProtocolo = protocoloMatch[0];
        }

        // Captura a Validade
        const validadeMatch = line.match(validadeRegex);
        if (validadeMatch && line.includes("Validade:")) {
            extractedData.validade = validadeMatch[0];
        }

        // Captura o Nome/Razão Social
        if (line.startsWith("Nome/Razão Social:")) {
            extractedData.nomeRazaoSocial = line.replace("Nome/Razão Social:", "").trim();
        }

        // Captura o CPF/CNPJ
        const cpfCnpjMatch = line.match(cpfCnpjRegex);
        if (cpfCnpjMatch && line.includes("CPF/CNPJ:")) {
            extractedData.cpfCnpj = cpfCnpjMatch[0];
        }

        // Captura as Condições
        if (line.startsWith("O Outorgado (")) {
            let condicoes = [];
            // Começa a captura a partir da linha atual até o final do arquivo
            for (let j = i; j < lines.length; j++) {
                const currentLine = lines[j].trim();
                // Adiciona a linha às condições, se não estiver vazia
                if (currentLine) {
                    condicoes.push(currentLine);
                }
            }
            extractedData.condicoes = condicoes.join('\n').trim();
            // Sai do loop após capturar as condições, pois já leu até o final do arquivo
            break;
        }
    }

    return extractedData;
}