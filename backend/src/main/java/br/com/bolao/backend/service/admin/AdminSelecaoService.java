package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.dto.admin.SelecaoAdminDTO;
import br.com.bolao.backend.exception.AdminException;
import br.com.bolao.backend.model.Selecao;
import br.com.bolao.backend.repository.SelecaoRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class AdminSelecaoService {

    private final SelecaoRepository selecaoRepository;

    public AdminSelecaoService(SelecaoRepository selecaoRepository) {
        this.selecaoRepository = selecaoRepository;
    }

    public List<SelecaoAdminDTO> listarSelecoes() {
        return selecaoRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(this::obterNomeOrdenacao))
                .map(this::converterParaDTO)
                .toList();
    }

    public void criarSelecao(String nome, String codigoFifa, String grupo) {
        validarTexto(nome, "Informe o nome da seleção.");
        validarTexto(codigoFifa, "Informe o código FIFA da seleção.");
        validarTexto(grupo, "Informe o grupo da seleção.");

        Selecao selecao = new Selecao();
        selecao.setNome(nome.trim());
        selecao.setCodigoFifa(codigoFifa.trim().toUpperCase());
        selecao.setGrupo(grupo.trim().toUpperCase());

        selecaoRepository.save(selecao);
    }

    private SelecaoAdminDTO converterParaDTO(Selecao selecao) {
        return new SelecaoAdminDTO(
                selecao.getId(),
                formatarTexto(selecao.getNome()),
                formatarTexto(selecao.getCodigoFifa()),
                formatarTexto(selecao.getGrupo())
        );
    }

    private String obterNomeOrdenacao(Selecao selecao) {
        if (selecao.getNome() == null) {
            return "";
        }

        return selecao.getNome();
    }

    private void validarTexto(String valor, String mensagem) {
        if (valor == null || valor.isBlank()) {
            throw new AdminException(mensagem);
        }
    }

    private String formatarTexto(String valor) {
        if (valor == null || valor.isBlank()) {
            return "-";
        }

        return valor;
    }
}