package br.com.bolao.backend.controller.advice;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import br.com.bolao.backend.exception.AdminException;

@ControllerAdvice
public class AdminExceptionHandler {

    @ExceptionHandler(AdminException.class)
    public String tratarErroAdmin(AdminException exception, Model model) {
        model.addAttribute("tituloErro", "Não foi possível concluir a ação");
        model.addAttribute("mensagemErro", exception.getMessage());
        return "admin/erro";
    }

    @ExceptionHandler(Exception.class)
    public String tratarErroInesperado(Exception exception, Model model) {
        model.addAttribute("tituloErro", "Erro inesperado");
        model.addAttribute("mensagemErro", "Ocorreu um erro ao processar a solicitação.");
        return "admin/erro";
    }
}