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

    public SelecaoAdminDTO buscarSelecao(Long id) {
        Selecao selecao = selecaoRepository.findById(id)
                .orElseThrow(() -> new AdminException("Seleção não encontrada."));

        return converterParaDTO(selecao);
    }

    public void criarSelecao(String nome, String codigoFifa, String grupo) {
        validarDados(nome, codigoFifa, grupo);

        Selecao selecao = new Selecao();
        selecao.setNome(nome.trim());
        selecao.setCodigoFifa(codigoFifa.trim().toUpperCase());
        selecao.setGrupo(grupo.trim().toUpperCase());

        selecaoRepository.save(selecao);
    }

    public void editarSelecao(Long id, String nome, String codigoFifa, String grupo) {
        validarDados(nome, codigoFifa, grupo);

        Selecao selecao = selecaoRepository.findById(id)
                .orElseThrow(() -> new AdminException("Seleção não encontrada."));

        selecao.setNome(nome.trim());
        selecao.setCodigoFifa(codigoFifa.trim().toUpperCase());
        selecao.setGrupo(grupo.trim().toUpperCase());

        selecaoRepository.save(selecao);
    }

    public void excluirSelecao(Long id) {
        Selecao selecao = selecaoRepository.findById(id)
                .orElseThrow(() -> new AdminException("Seleção não encontrada."));

        try {
            selecaoRepository.delete(selecao);
        } catch (RuntimeException exception) {
            throw new AdminException("Não é possível excluir uma seleção vinculada a uma partida.");
        }
    }

    private void validarDados(String nome, String codigoFifa, String grupo) {
        validarTexto(nome, "Informe o nome da seleção.");
        validarTexto(codigoFifa, "Informe o código FIFA da seleção.");
        validarTexto(grupo, "Informe o grupo da seleção.");

        if (codigoFifa.trim().length() < 2 || codigoFifa.trim().length() > 5) {
            throw new AdminException("Informe um código FIFA válido.");
        }

        if (grupo.trim().length() > 2) {
            throw new AdminException("Informe um grupo válido.");
        }
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