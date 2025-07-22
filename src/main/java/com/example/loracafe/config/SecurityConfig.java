package com.example.loracafe.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http.cors((cors) -> cors.configurationSource(corsConfigurationSource()))

                                // --- REGLAS DE AUTORIZACIÓN DE RUTAS ---
                                .authorizeHttpRequests(auth -> auth
                                                // REGLA 1: Recursos estáticos siempre públicos
                                                .requestMatchers("/assets/**", "/Vista/**", "/img/**").permitAll()

                                                // REGLA 2: Páginas públicas del cliente
                                                .requestMatchers("/", "/inicio", "/sobrenosotros", "/carta", "/login",
                                                                "/registro", "/Cliente/pago", "/Cliente/pago.html")
                                                .permitAll()

                                                // REGLA 3: APIs públicas del cliente
                                                .requestMatchers("/api/client/products/**", "/api/client/promotions/**")
                                                .permitAll()

                                                // REGLA 4: Secciones del Dashboard solo para ADMIN
                                                .requestMatchers("/dashboard/**", "/api/dashboard/**").hasRole("ADMIN")

                                                // REGLA 5: Secciones que requieren que el usuario esté logueado
                                                // (cualquier rol)
                                                .requestMatchers(
                                                                "/carrito",
                                                                "/mi-cuenta/**",
                                                                "/api/client/orders/**",
                                                                "/api/client/account/**",
                                                                "/api/client/messages"
                                                // La API de mensajes ahora es manejada por CSRF, pero la dejamos aquí
                                                // por
                                                // claridad
                                                // si en el futuro se cambia a solo usuarios logueados.
                                                ).authenticated()

                                                // REGLA FINAL: Cualquier otra URL no definida, por seguridad, requerirá
                                                // autenticación.
                                                .anyRequest().authenticated())
                                // --- CONFIGURACIÓN DE LOGIN Y LOGOUT ---
                                .formLogin(form -> form
                                                .loginPage("/login")
                                                .loginProcessingUrl("/login")
                                                .defaultSuccessUrl("/inicio", true) // Simplificado, el modal lo podemos
                                                                                    // manejar con JS
                                                .permitAll())
                                .logout(logout -> logout
                                                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                                                .logoutSuccessUrl("/login?logout")
                                                .permitAll())

                                .exceptionHandling(exceptions -> exceptions
                                                .accessDeniedPage("/acceso-denegado"));

                return http.build();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.addAllowedOrigin("http://localhost:8090");
                configuration.addAllowedMethod("*");
                configuration.addAllowedHeader("*");
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}