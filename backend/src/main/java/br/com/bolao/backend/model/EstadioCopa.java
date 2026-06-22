package br.com.bolao.backend.model;

public enum EstadioCopa {

    ATLANTA_STADIUM("Atlanta Stadium"),
    BOSTON_STADIUM("Boston Stadium"),
    DALLAS_STADIUM("Dallas Stadium"),
    ESTADIO_GUADALAJARA("Estadio Guadalajara"),
    HOUSTON_STADIUM("Houston Stadium"),
    KANSAS_CITY_STADIUM("Kansas City Stadium"),
    LOS_ANGELES_STADIUM("Los Angeles Stadium"),
    ESTADIO_CIUDAD_DE_MEXICO("Estadio Ciudad de Mexico"),
    MIAMI_STADIUM("Miami Stadium"),
    ESTADIO_MONTERREY("Estadio Monterrey"),
    NEW_YORK_NEW_JERSEY_STADIUM("New York/New Jersey Stadium"),
    PHILADELPHIA_STADIUM("Philadelphia Stadium"),
    SAN_FRANCISCO_BAY_AREA_STADIUM("San Francisco Bay Area Stadium"),
    SEATTLE_STADIUM("Seattle Stadium"),
    TORONTO_STADIUM("Toronto Stadium"),
    VANCOUVER_STADIUM("Vancouver Stadium");

    private final String descricao;

    EstadioCopa(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}