package br.com.bolao.backend.repository;

import br.com.bolao.backend.model.Selecao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SelecaoRepository extends JpaRepository<Selecao, Long> {
}