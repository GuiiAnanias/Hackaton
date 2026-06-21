package br.com.bolao.backend.repository;

import br.com.bolao.backend.model.Palpite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PalpiteRepository extends JpaRepository<Palpite, Long> {

    List<Palpite> findByPartidaId(Long partidaId);

    List<Palpite> findByUsuarioId(Long usuarioId);
    Optional<Palpite> findByUsuarioIdAndPartidaId(Long usuarioId, Long partidaId);
}